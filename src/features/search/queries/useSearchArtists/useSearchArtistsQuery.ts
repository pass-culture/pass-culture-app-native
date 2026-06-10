import { useQuery } from '@tanstack/react-query'

import { getSearchQueryKey } from 'features/search/queries/helpers.ts'
import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'
import { FetchSearchResultsArgs } from 'features/search/types'
import { fetchSearchArtists } from 'libs/algolia/fetchAlgolia/fetchSearchArtists/fetchSearchArtists'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useSearchArtistsQuery = <TSelect = FetchSearchArtistsResponse>(
  params: FetchSearchResultsArgs,
  options?: CustomQueryOptions<FetchSearchArtistsResponse, TSelect>
) => {
  const { buildLocationParameterParams, parameters } = params
  return useQuery({
    queryKey: [
      QueryKeys.SEARCH_RESULTS_ARTISTS,
      buildLocationParameterParams.userLocation,
      getSearchQueryKey(parameters),
    ],
    queryFn: () => fetchSearchArtists(params),
    ...options,
  })
}
