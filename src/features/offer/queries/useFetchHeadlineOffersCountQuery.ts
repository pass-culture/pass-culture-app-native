import { useQuery } from '@tanstack/react-query'

import { OfferResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import { fetchHeadlineOffersCount } from '../api/headlineOffers/fetchHeadlineOffersCount'

export const useFetchHeadlineOffersCountQuery = (offer?: OfferResponse) => {
  const ean = offer?.extraData?.ean

  return useQuery({
    queryKey: [QueryKeys.HEADLINE_OFFERS_COUNT, ean],
    queryFn: () => fetchHeadlineOffersCount(offer),
    enabled: !!ean,
  })
}
