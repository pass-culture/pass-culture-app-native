import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { mapOffersDataAndModules } from 'features/home/api/helpers/mapOffersDataAndModules'
import {
  ArtistEditorialModule,
  ArtistPlaylistModule,
  ModuleData,
  OfferModuleParamsInfo,
  OffersModule,
} from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersModules } from 'libs/algolia/fetchAlgolia/fetchOffersModules'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { PlaylistOffersParams } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'

const isPlaylistOffersParameters = (parameter: unknown): parameter is PlaylistOffersParams =>
  typeof parameter === 'object' && parameter !== null

const isPlaylistOffersParamsArrayWithoutUndefined = (
  params: unknown
): params is PlaylistOffersParams[] => params !== undefined

export const getOffersModuleQueryKey = (
  moduleId: string,
  adaptedPlaylistParameters: PlaylistOffersParams[],
  isUserUnderage: boolean
) => [QueryKeys.HOME_MODULE, moduleId, adaptedPlaylistParameters, isUserUnderage] as const

const STALE_TIME_OFFERS_MODULE = 5 * 60 * 1000

const useOffersModuleParameters = (module: OffersModule | ArtistPlaylistModule) => {
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()

  return useMemo(
    () =>
      module.offersModuleParameters
        .map((offerModuleParameter) => adaptPlaylistParameters(offerModuleParameter))
        .filter(isPlaylistOffersParameters),
    [adaptPlaylistParameters, module.offersModuleParameters]
  )
}

export const useGetOffersModuleDataQuery = (module: OffersModule | ArtistPlaylistModule) => {
  const adaptedPlaylistParameters = useOffersModuleParameters(module)
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  return useQuery({
    queryKey: getOffersModuleQueryKey(module.id, adaptedPlaylistParameters, isUserUnderage),
    queryFn: async (): Promise<ModuleData | undefined> => {
      const result = await fetchOffersModules({
        paramsList: [adaptedPlaylistParameters],
        isUserUnderage,
      })

      return mapOffersDataAndModules({
        data: result.filter(searchResponsePredicate),
        modulesParams: [{ adaptedPlaylistParameters, moduleId: module.id }],
        transformHits,
      })[0]
    },
    enabled: adaptedPlaylistParameters.length > 0,
    staleTime: STALE_TIME_OFFERS_MODULE,
  })
}

export const useGetOffersDataQuery = (
  modules: (OffersModule | ArtistPlaylistModule | ArtistEditorialModule)[]
) => {
  const queryClient = useQueryClient()
  const transformHits = useTransformOfferHits()

  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const isUserUnderage = useIsUserUnderage()

  const offersParameters = modules.map((module) => ({
    adaptedPlaylistParameters: module.offersModuleParameters
      .map((offerModuleParameter) => adaptPlaylistParameters(offerModuleParameter))
      .filter(isPlaylistOffersParameters),
    moduleId: module.id,
  })) satisfies OfferModuleParamsInfo[]

  const offersAdaptedPlaylistParametersWithoutUndefined = offersParameters
    .map((param) => param.adaptedPlaylistParameters)
    .filter(isPlaylistOffersParamsArrayWithoutUndefined)

  const offersQuery = async () => {
    const result = await fetchOffersModules({
      paramsList: offersAdaptedPlaylistParametersWithoutUndefined,
      isUserUnderage,
    })

    const moduleData = mapOffersDataAndModules({
      data: result.filter(searchResponsePredicate),
      modulesParams: offersParameters,
      transformHits,
    })

    return { moduleData, offersParameters, isUserUnderage }
  }

  const offersResultList = useQuery({
    queryKey: [QueryKeys.HOME_MODULE, offersParameters, isUserUnderage],
    queryFn: offersQuery,
    enabled: offersAdaptedPlaylistParametersWithoutUndefined.length > 0,
  })

  useEffect(() => {
    offersResultList.data?.moduleData.forEach((data) => {
      const moduleParameters = offersResultList.data.offersParameters.find(
        ({ moduleId }) => moduleId === data.moduleId
      )

      if (moduleParameters) {
        queryClient.setQueryData(
          getOffersModuleQueryKey(
            data.moduleId,
            moduleParameters.adaptedPlaylistParameters,
            offersResultList.data.isUserUnderage
          ),
          data
        )
      }
    })
  }, [offersResultList.data, queryClient])

  return offersResultList.data?.moduleData ?? []
}
