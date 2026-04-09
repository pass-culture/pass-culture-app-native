import { useQuery } from '@tanstack/react-query'

import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'
import { FetchSearchResultsArgs } from 'features/search/types'
import { fetchSearchVenues } from 'libs/algolia/fetchAlgolia/fetchSearchVenues/fetchSearchVenues'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useSearchVenuesQuery = <TSelect = FetchSearchVenuesResponse>(
  params: FetchSearchResultsArgs,
  options?: CustomQueryOptions<FetchSearchVenuesResponse, TSelect>
) => {
  const { buildLocationParameterParams, disabilitiesProperties, parameters } = params
  return useQuery({
    queryKey: [
      QueryKeys.SEARCH_RESULTS_VENUES,
      buildLocationParameterParams.userLocation,
      disabilitiesProperties,
      parameters,
    ],
    queryFn: () => fetchSearchVenues(params),
    ...options,
  })
}
