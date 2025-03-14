import { useQuery } from 'react-query'

import { OfferResponseV2 } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import { fetchHeadlineOffersCount } from './fetchHeadlineOffersCount'

export const useFetchHeadlineOffersCount = (offer?: OfferResponseV2) => {
  return useQuery({
    queryKey: [QueryKeys.HEADLINE_OFFERS_COUNT],
    queryFn: () => fetchHeadlineOffersCount(offer),
  })
}
