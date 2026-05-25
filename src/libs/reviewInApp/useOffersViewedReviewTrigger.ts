import { useEffect, useRef } from 'react'

import {
  incrementOffersViewedCount,
  resetOffersViewedCount,
} from 'libs/reviewInApp/offersViewedCounter'
import {
  OFFERS_VIEWED_REVIEW_DELAY_MS,
  OFFERS_VIEWED_REVIEW_THRESHOLD,
} from 'libs/reviewInApp/types'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'

export const useOffersViewedReviewTrigger = (offerId: number | undefined): void => {
  const { requestReview } = useReviewInApp()
  const requestReviewRef = useRef(requestReview)

  useEffect(() => {
    requestReviewRef.current = requestReview
  })

  // Guard against StrictMode double-mount and consecutive remounts on the same offerId.
  const processedOfferIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!offerId) return
    if (processedOfferIdRef.current === offerId) return
    processedOfferIdRef.current = offerId

    let cancelled = false

    const recordOfferViewAndMaybeRequestReview = async () => {
      const count = await incrementOffersViewedCount()
      if (cancelled) return
      if (count < OFFERS_VIEWED_REVIEW_THRESHOLD) return

      const scheduled = await requestReviewRef.current('offers_viewed', {
        delayMs: OFFERS_VIEWED_REVIEW_DELAY_MS,
      })
      if (scheduled) {
        await resetOffersViewedCount()
      }
    }

    void recordOfferViewAndMaybeRequestReview()

    return () => {
      cancelled = true
    }
  }, [offerId])
}
