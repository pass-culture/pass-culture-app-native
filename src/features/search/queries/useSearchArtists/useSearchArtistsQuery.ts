import { useQuery } from '@tanstack/react-query'

import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'
import { FetchSearchResultsArgs } from 'features/search/types'
import { fetchSearchArtists } from 'libs/algolia/fetchAlgolia/fetchSearchArtists/fetchSearchArtists'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useSearchArtistsQuery = <TSelect = FetchSearchArtistsResponse>(
  params: FetchSearchResultsArgs,
  options?: CustomQueryOptions<FetchSearchArtistsResponse, TSelect>
) => {
  const { buildLocationParameterParams, disabilitiesProperties, parameters } = params

  return useQuery({
    queryKey: [
      QueryKeys.SEARCH_RESULTS_ARTISTS,
      buildLocationParameterParams.userLocation,
      disabilitiesProperties,
      parameters,
    ],
    queryFn: () => fetchSearchArtists(params),
    ...options,
  })
}
