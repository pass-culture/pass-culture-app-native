import { UseQueryResult, useQuery } from 'react-query'

import { Venue, VenuesModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { QueryKeys } from 'libs/queryKeys'

export const useVenuesQuery = (
  venuesParameters: (VenuesModuleParameters & BuildLocationParameterParams)[],
  venuesModuleIds: string[]
): UseQueryResult<{
  hits: Venue[][]
  moduleId: string[]
}> => {
  const venuesQuery = async () => {
    const result = await fetchVenuesModules(venuesParameters)
    return {
      hits: result,
      moduleId: venuesModuleIds,
    }
  }

  return useQuery({
    queryKey: [QueryKeys.HOME_VENUES_MODULE, venuesModuleIds],
    queryFn: venuesQuery,
    enabled: venuesParameters.length > 0,
  })
}
