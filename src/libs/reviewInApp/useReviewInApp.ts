import { useCallback, useMemo, useRef } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { appendHistory, canRequestReview, readHistory } from 'libs/reviewInApp/reviewHistory'
import {
  DEFAULT_DELAY_MS,
  REVIEW_TRIGGER_FEATURE_FLAGS,
  ReviewTriggerSource,
} from 'libs/reviewInApp/types'

type RequestReviewOptions = {
  delayMs?: number
}

export const useReviewInApp = () => {
  const disableStoreReview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW)
  const bookingTriggerEnabled = useFeatureFlag(REVIEW_TRIGGER_FEATURE_FLAGS.booking_success)
  const creditTriggerEnabled = useFeatureFlag(REVIEW_TRIGGER_FEATURE_FLAGS.credit_received)
  const likeTriggerEnabled = useFeatureFlag(REVIEW_TRIGGER_FEATURE_FLAGS.booking_liked)
  const offersTriggerEnabled = useFeatureFlag(REVIEW_TRIGGER_FEATURE_FLAGS.offers_viewed)

  const triggerEnabledBySource = useMemo<Record<ReviewTriggerSource, boolean>>(
    () => ({
      booking_success: bookingTriggerEnabled,
      credit_received: creditTriggerEnabled,
      booking_liked: likeTriggerEnabled,
      offers_viewed: offersTriggerEnabled,
    }),
    [bookingTriggerEnabled, creditTriggerEnabled, likeTriggerEnabled, offersTriggerEnabled]
  )

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const inFlightRef = useRef(false)

  const cancelPending = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    inFlightRef.current = false
  }, [])

  useAppStateChange(undefined, cancelPending, [])

  const requestReview = useCallback(
    async (source: ReviewTriggerSource, options?: RequestReviewOptions): Promise<void> => {
      if (!InAppReview.isAvailable()) return
      if (disableStoreReview) return
      if (!triggerEnabledBySource[source]) return

      if (inFlightRef.current) return
      if (timeoutRef.current !== undefined) return

      const history = await readHistory()
      if (!canRequestReview(history, Date.now())) return

      inFlightRef.current = true
      timeoutRef.current = setTimeout(() => {
        InAppReview.RequestInAppReview()
          .catch((error) => {
            eventMonitoring.captureException(error, { extra: { source, trigger: 'in_app_review' } })
          })
          .finally(() => {
            void appendHistory(Date.now())
            timeoutRef.current = undefined
            inFlightRef.current = false
          })
      }, options?.delayMs ?? DEFAULT_DELAY_MS)
    },
    [disableStoreReview, triggerEnabledBySource]
  )

  return { requestReview }
}
