import { useQuery } from 'react-query'

import { OfferResponseV2 } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import { fetchHeadlineOffersCount } from '../api/headlineOffers/fetchHeadlineOffersCount'

export const useFetchHeadlineOffersCountQuery = (offer?: OfferResponseV2) => {
  return useQuery({
    queryKey: [QueryKeys.HEADLINE_OFFERS_COUNT],
    queryFn: () => fetchHeadlineOffersCount(offer),
  })
}
