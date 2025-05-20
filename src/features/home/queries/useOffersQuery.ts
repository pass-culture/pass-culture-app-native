import { useQuery } from 'react-query'

import { fetchCarouselVideoOffers } from 'libs/algolia/fetchAlgolia/fetchCarouselVideoOffers'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { OfferModuleQuery } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersQuery = (moduleId: string, queries: OfferModuleQuery[]) => {
  const offersQuery = async () => {
    const offersResultList = await fetchCarouselVideoOffers(queries)
    return offersResultList.filter(searchResponsePredicate)
  }

  return useQuery({
    queryKey: [QueryKeys.VIDEO_CAROUSEL_OFFERS, moduleId],
    queryFn: offersQuery,
    enabled: queries.length > 0,
  })
}
