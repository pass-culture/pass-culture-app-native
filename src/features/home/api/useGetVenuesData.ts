import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { mapVenuesDataAndModules } from 'features/home/api/helpers/mapVenuesDataAndModules'
import { VenuesModule, VenuesModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

export const useGetVenuesData = (modules: VenuesModule[]) => {
  const { userLocation, selectedLocationMode } = useLocation()

  const venuesParameters: (VenuesModuleParameters & BuildLocationParameterParams)[] = []
  const venuesModuleIds: string[] = []

  modules.forEach((module) => {
    const radius =
      module.venuesParameters.isGeolocated && module.venuesParameters.aroundRadius
        ? module.venuesParameters.aroundRadius
        : 'all'
    venuesParameters.push({
      ...module.venuesParameters,
      userLocation,
      selectedLocationMode,
      aroundMeRadius: radius,
      aroundPlaceRadius: radius,
    })
    venuesModuleIds.push(module.id)
  })

  const venuesQuery = async () => {
    const result = await fetchVenuesModules(venuesParameters)
    return {
      hits: result,
      moduleId: venuesModuleIds,
    }
  }

  const venuesResultList = useQuery({
    queryKey: [QueryKeys.HOME_VENUES_MODULE, venuesModuleIds],
    queryFn: venuesQuery,
    enabled: venuesParameters.length > 0,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    venuesResultList.refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude])

  const venuesModulesData = mapVenuesDataAndModules(venuesResultList)

  return { venuesModulesData }
}
