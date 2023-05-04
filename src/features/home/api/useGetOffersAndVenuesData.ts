import { uniqBy } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useQueries } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import {
  HomepageModule,
  OffersData,
  VenuesData,
  isOffersModule,
  isVenuesModule,
} from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchMultipleVenues } from 'libs/algolia/fetchAlgolia/fetchMultipleVenues'
import { useTransformOfferHits, filterOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

export const useGetOffersAndVenuesData = (modules: HomepageModule[]) => {
  const { position } = useHomePosition()
  const transformHits = useTransformOfferHits()

  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const isUserUnderage = useIsUserUnderage()
  const { user } = useAuthContext()
  const netInfo = useNetInfoContext()

  const queriesParams = modules.map((module) => {
    if (isOffersModule(module)) {
      const adaptedPlaylistParameters = module.offersModuleParameters
        .map(adaptPlaylistParameters)
        .filter(isSearchState)
      const queryFn = async () => {
        const result = await fetchMultipleOffers({
          paramsList: adaptedPlaylistParameters,
          userLocation: position,
          isUserUnderage,
        })
        const hits = result.hits.filter(filterOfferHit).map(transformHits)
        return {
          hits: uniqBy(hits, 'objectID') as Offer[],
          nbHits: result.nbHits,
          moduleId: module.id,
        }
      }
      return { queryKeys: [QueryKeys.HOME_MODULE, module.id], queryFn }
    }

    if (isVenuesModule(module)) {
      const queryFn = async () => {
        const result = await fetchMultipleVenues(module.venuesParameters, position)
        return {
          hits: result,
          moduleId: module.id,
        }
      }
      return { queryKeys: [QueryKeys.HOME_MODULE, module.id], queryFn }
    }

    return
  })

  const queriesParamsWithoutUndefined = queriesParams.filter((q) => q !== undefined) as {
    queryKeys: string[]
    queryFn: () => Promise<OffersData> | Promise<VenuesData>
  }[]

  const resultList = useQueries(
    queriesParamsWithoutUndefined.map((query) => ({
      queryKey: query.queryKeys,
      queryFn: query.queryFn,
      enabled: !!netInfo.isConnected,
    }))
  )

  const refetchAll = useCallback(async () => {
    for (const result of resultList) {
      await result.refetch()
    }
  }, [resultList])

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetchAll().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  return { modulesData: resultList }
}
