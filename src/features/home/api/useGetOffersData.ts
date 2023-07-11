import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { mapOffersDataAndModules } from 'features/home/api/helpers/mapOffersDataAndModules'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModule, OfferModuleParamsInfo } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersModules } from 'libs/algolia/fetchAlgolia/fetchOffersModules'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

const isSearchStateArrayWithoutUndefined = (params: unknown): params is SearchState[] =>
  params !== undefined

export const useGetOffersData = (modules: OffersModule[]) => {
  const { position } = useHomePosition()
  const transformHits = useTransformOfferHits()

  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const isUserUnderage = useIsUserUnderage()
  const { user } = useAuthContext()
  const netInfo = useNetInfoContext()

  const offersModuleIds: string[] = []

  const offersParameters = modules.map((module) => {
    const adaptedPlaylistParameters = module.offersModuleParameters
      .map(adaptPlaylistParameters)
      .filter(isSearchState)
    offersModuleIds.push(module.id)
    return {
      adaptedPlaylistParameters: adaptedPlaylistParameters,
      moduleId: module.id,
    } as OfferModuleParamsInfo
  })

  const offersAdaptedPlaylistParametersWithoutUndefined = offersParameters
    .map((param) => param?.adaptedPlaylistParameters)
    .filter(isSearchStateArrayWithoutUndefined)

  const offersQuery = async () => {
    const result = await fetchOffersModules({
      paramsList: offersAdaptedPlaylistParametersWithoutUndefined,
      userLocation: position,
      isUserUnderage,
    })

    return result
  }

  const offersResultList = useQuery({
    queryKey: [QueryKeys.HOME_MODULE, offersModuleIds],
    queryFn: offersQuery,
    enabled: !!netInfo.isConnected && offersAdaptedPlaylistParametersWithoutUndefined.length > 0,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    offersResultList.refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  const offersModulesData = mapOffersDataAndModules({
    results: offersResultList,
    modulesParams: offersParameters,
    transformHits,
  })

  return { offersModulesData }
}
