import { analytics } from 'libs/analytics'
import { PartialOffer, usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'

type AnalyticsParams = Parameters<typeof analytics.logConsultOffer>[0]

type HandlePressOfferParams = {
  offer: PartialOffer
  analyticsParams: AnalyticsParams
}

export const useHandleOfferTile = () => {
  const prePopulateOffer = usePrePopulateOffer()
  function handlePressOffer({ offer, analyticsParams }: HandlePressOfferParams) {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    prePopulateOffer(offer)
    analytics.logConsultOffer(analyticsParams)
  }

  return { handlePressOffer }
}
