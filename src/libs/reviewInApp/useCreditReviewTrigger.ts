import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef } from 'react'

import {
  clearCreditReviewEligibility,
  peekCreditReviewEligibility,
} from 'libs/reviewInApp/creditReviewTrigger'
import { CREDIT_REVIEW_DELAY_MS } from 'libs/reviewInApp/types'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'

export const useCreditReviewTrigger = (): void => {
  const { requestReview } = useReviewInApp()
  const requestReviewRef = useRef(requestReview)

  useEffect(() => {
    requestReviewRef.current = requestReview
  })

  // useFocusEffect (not useEffect): the Home stays mounted in the TabNavigator,
  // so we must react on each focus. The one-shot flag guarantees a single prompt.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false

      const run = async () => {
        const eligible = await peekCreditReviewEligibility()
        if (cancelled || !eligible) return
        // Only burn the one-shot flag once the prompt is actually triggered:
        // requestReview returns false when it cannot show (FF off, quota, in-flight…),
        // in which case the user stays eligible for the next Home focus.
        const requested = await requestReviewRef.current('credit_received', {
          delayMs: CREDIT_REVIEW_DELAY_MS,
        })
        if (requested) await clearCreditReviewEligibility()
      }

      void run()

      return () => {
        cancelled = true
      }
    }, [])
  )
}
