import { useEffect } from 'react'

import { mapVenuesDataAndModules } from 'features/home/api/helpers/mapVenuesDataAndModules'
import { VenuesModule, VenuesModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { useLocation } from 'libs/location'

import { useVenuesQuery } from '../queries/useVenuesQuery'

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

  const venuesResultList = useVenuesQuery(venuesParameters, venuesModuleIds)

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
