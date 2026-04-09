import { useInfiniteQuery } from '@tanstack/react-query'

import { FetchSearchOffersResponse } from 'features/search/queries/useSearchOffersQuery/types'
import { FetchSearchResultsArgs } from 'features/search/types'
import { fetchSearchOffers } from 'libs/algolia/fetchAlgolia/fetchSearchOffers/fetchSearchOffers'
import { QueryKeys } from 'libs/queryKeys'
import { CustomInfiniteQueryOptions } from 'libs/react-query/types'
import { getNextPageParam } from 'shared/getNextPageParam/getNextPageParam'

export const useSearchOffersQuery = <TSelect = FetchSearchOffersResponse>(
  params: FetchSearchResultsArgs,
  options?: CustomInfiniteQueryOptions<FetchSearchOffersResponse, TSelect>
) => {
  const { buildLocationParameterParams, disabilitiesProperties, parameters } = params

  return useInfiniteQuery({
    queryKey: [
      QueryKeys.SEARCH_RESULTS_OFFERS,
      buildLocationParameterParams.userLocation,
      disabilitiesProperties,
      parameters,
    ],
    queryFn: ({ pageParam }) =>
      fetchSearchOffers({
        ...params,
        parameters: { ...params.parameters, page: pageParam },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.offersResponse ? getNextPageParam(lastPage.offersResponse) : undefined
    },
    ...options,
  })
}
