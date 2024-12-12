import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { mapVenuesDataAndModules } from 'features/home/api/helpers/mapVenuesDataAndModules'
import { AppV2VenuesModule, VenuesModule, VenuesModuleParameters } from 'features/home/types'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

export const useGetVenuesData = (modules: (VenuesModule | AppV2VenuesModule)[]) => {
  const { userLocation, selectedLocationMode } = useLocation()

  const venuesParameters: VenuesModuleParameters[] = []
  const venuesModuleIds: string[] = []

  modules.forEach((module) => {
    venuesParameters.push(module.venuesParameters)
    venuesModuleIds.push(module.id)
  })

  const venuesQuery = async () => {
    const result = await fetchVenuesModules(venuesParameters, {
      userLocation,
      selectedLocationMode,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    })
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
