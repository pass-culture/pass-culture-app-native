import { useCallback } from 'react'

import { analytics } from 'libs/analytics/provider'

type UseOfferHeaderTrackingParams = {
  offerId: number
}

export function useOfferHeaderTracking({ offerId }: UseOfferHeaderTrackingParams) {
  const trackShare = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'offer', offerId })
  }, [offerId])

  return { trackShare }
}
