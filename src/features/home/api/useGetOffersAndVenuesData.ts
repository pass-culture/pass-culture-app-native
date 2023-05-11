import { uniqBy } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useQueries, useQuery } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { mergeOffersAndVenuesData } from 'features/home/api/helpers/mergeOffersAndVenuesData'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { HomepageModule, OffersData, isOffersModule, isVenuesModule } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchVenuesModules } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
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

  const venuesModules = modules.filter(isVenuesModule)
  const venuesParameters = venuesModules.map((module) => module.venuesParameters[0])

  const venuesQuery = async () => {
    const result = await fetchVenuesModules(venuesParameters, position)
    return {
      hits: result,
      moduleId: venuesModules.map((module) => module.id),
    }
  }

  const venuesResultList = useQuery({
    queryKey: [QueryKeys.HOME_VENUES_MODULE],
    queryFn: venuesQuery,
    enabled: !!netInfo.isConnected && venuesParameters.length > 0,
  })

  const offersQueries = modules.map((module) => {
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

    return
  })

  const offersQueriesWithoutUndefined = offersQueries.filter((q) => q !== undefined) as {
    queryKeys: string[]
    queryFn: () => Promise<OffersData>
  }[]

  const offersResultList = useQueries(
    offersQueriesWithoutUndefined.map((query) => ({
      queryKey: query.queryKeys,
      queryFn: query.queryFn,
      enabled: !!netInfo.isConnected,
    }))
  )

  const refetchAllOffers = useCallback(async () => {
    for (const result of offersResultList) {
      await result.refetch()
    }
  }, [offersResultList])

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    venuesResultList.refetch().catch(() => {
      return
    })
    refetchAllOffers().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  const mergedData = mergeOffersAndVenuesData({ offersResultList, venuesResultList })

  return { modulesData: mergedData }
}
