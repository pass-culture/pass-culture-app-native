import { useQuery } from 'react-query'

import { fetchCarouselVideoOffers } from 'libs/algolia/fetchAlgolia/fetchCarouselVideoOffers'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { OfferModuleQuery } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersQuery = (moduleId: string, queries: OfferModuleQuery[]) => {
  return useQuery({
    queryKey: [QueryKeys.VIDEO_CAROUSEL_OFFERS, moduleId],
    queryFn: async () => fetchCarouselVideoOffers(queries),
    enabled: queries.length > 0,
    select(offersResultList) {
      return offersResultList.filter(searchResponsePredicate)
    },
  })
}
