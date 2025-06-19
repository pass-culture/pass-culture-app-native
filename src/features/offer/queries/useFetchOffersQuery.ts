import { useQuery } from '@tanstack/react-query'

import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { QueryKeys } from 'libs/queryKeys'

export const useFetchOffersQuery = (...params: Parameters<typeof fetchOffers>) => {
  return useQuery({
    queryKey: [QueryKeys.SEARCH_RESULTS, params],
    queryFn: () => fetchOffers(...params),
  })
}
