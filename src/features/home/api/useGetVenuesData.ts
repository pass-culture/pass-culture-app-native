import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { mapVenuesDataAndModules } from 'features/home/api/helpers/mapVenuesDataAndModules'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { VenuesModule, VenuesModuleParameters } from 'features/home/types'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useGetVenuesData = (modules: VenuesModule[]) => {
  const { position } = useHomePosition()

  const { user } = useAuthContext()
  const netInfo = useNetInfoContext()

  const venuesParameters: VenuesModuleParameters[] = []
  const venuesModuleIds: string[] = []

  modules.forEach((module) => {
    venuesParameters.push(module.venuesParameters)
    venuesModuleIds.push(module.id)
  })

  const venuesQuery = async () => {
    const result = await fetchVenuesModules(venuesParameters, position)
    return {
      hits: result,
      moduleId: venuesModuleIds,
    }
  }

  const venuesResultList = useQuery({
    queryKey: [QueryKeys.HOME_VENUES_MODULE, venuesModuleIds],
    queryFn: venuesQuery,
    enabled: !!netInfo.isConnected && venuesParameters.length > 0,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    venuesResultList.refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  const venuesModulesData = mapVenuesDataAndModules(venuesResultList)

  return { venuesModulesData }
}
