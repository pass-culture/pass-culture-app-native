import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { mapOffersDataAndModules } from 'features/home/api/helpers/mapOffersDataAndModules'
import { OfferModuleParamsInfo, OffersModule } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersModules } from 'libs/algolia/fetchAlgolia/fetchOffersModules'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { PlaylistOffersParams } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

const isPlaylistOffersParameters = (parameter: unknown): parameter is PlaylistOffersParams =>
  typeof parameter === 'object' && parameter !== null

const isPlaylistOffersParamsArrayWithoutUndefined = (
  params: unknown
): params is PlaylistOffersParams[] => params !== undefined

export const useGetOffersData = (modules: OffersModule[]) => {
  const { userLocation } = useLocation()
  const transformHits = useTransformOfferHits()

  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const isUserUnderage = useIsUserUnderage()

  const offersModuleIds: string[] = []

  const offersParameters = modules.map((module) => {
    const adaptedPlaylistParameters = module.offersModuleParameters
      .map(adaptPlaylistParameters)
      .filter(isPlaylistOffersParameters)
    offersModuleIds.push(module.id)
    return {
      adaptedPlaylistParameters: adaptedPlaylistParameters,
      moduleId: module.id,
    } as OfferModuleParamsInfo
  })

  const offersAdaptedPlaylistParametersWithoutUndefined = offersParameters
    .map((param) => param?.adaptedPlaylistParameters)
    .filter(isPlaylistOffersParamsArrayWithoutUndefined)

  const offersQuery = async () => {
    const result = await fetchOffersModules({
      paramsList: offersAdaptedPlaylistParametersWithoutUndefined,
      isUserUnderage,
    })
    const searchResponseResult = result.filter(searchResponsePredicate)

    return searchResponseResult
  }

  const offersResultList = useQuery({
    queryKey: [QueryKeys.HOME_MODULE, offersModuleIds],
    queryFn: offersQuery,
    enabled: offersAdaptedPlaylistParametersWithoutUndefined.length > 0,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    offersResultList.refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude])

  const offersModulesData = mapOffersDataAndModules({
    results: offersResultList,
    modulesParams: offersParameters,
    transformHits,
  })

  return { offersModulesData }
}
