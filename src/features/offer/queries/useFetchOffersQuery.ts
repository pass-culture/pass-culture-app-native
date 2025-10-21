import { useQuery } from '@tanstack/react-query'

import { FetchOfferArgs, fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { QueryKeys } from 'libs/queryKeys'

export const useFetchOffersQuery = ({
  params,
  options,
}: {
  params: FetchOfferArgs
  options?: { enabled: boolean }
}) =>
  useQuery({
    queryKey: [QueryKeys.SEARCH_RESULTS, params],
    queryFn: () => fetchOffers(params),
    ...options,
  })
