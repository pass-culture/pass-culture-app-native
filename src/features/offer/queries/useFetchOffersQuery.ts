import { useQuery } from '@tanstack/react-query'

import {
  FetchOfferArgs,
  FetchOffersResponse,
  fetchOffers,
} from 'libs/algolia/fetchAlgolia/fetchOffers'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useFetchOffersQuery = <TSelect = FetchOffersResponse>(
  params: FetchOfferArgs,
  options?: CustomQueryOptions<FetchOffersResponse, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.SEARCH_RESULTS, params],
    queryFn: () => fetchOffers(params),
    ...options,
  })
