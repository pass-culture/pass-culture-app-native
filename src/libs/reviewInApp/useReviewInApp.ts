import { useCallback, useRef } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { appendHistory, canRequestReview, readHistory } from 'libs/reviewInApp/reviewHistory'
import { DEFAULT_DELAY_MS, ReviewTriggerSource } from 'libs/reviewInApp/types'

type RequestReviewOptions = {
  delayMs?: number
}

export const useReviewInApp = () => {
  const disableStoreReview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW)
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
    async (
      // The source will also drive analytics and the per-trigger feature flag in upcoming tickets.
      source: ReviewTriggerSource,
      options?: RequestReviewOptions
    ): Promise<void> => {
      if (!InAppReview.isAvailable()) return
      if (disableStoreReview) return
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
    [disableStoreReview]
  )

  return { requestReview }
}
