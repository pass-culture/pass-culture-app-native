import uniqBy from 'lodash/uniqBy'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModuleParameters } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

interface UseOfferModuleProps {
  search: OffersModuleParameters[]
  moduleId: string
}

export const useOfferModule = ({
  search,
  moduleId,
}: UseOfferModuleProps): { hits: Offer[]; nbHits: number } | undefined => {
  const { position } = useHomePosition()
  const transformHits = useTransformOfferHits()

  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const isUserUnderage = useIsUserUnderage()
  const { user } = useAuthContext()
  const netInfo = useNetInfoContext()
  const parsedParameters = search.map(adaptedPlaylistParameters).filter(isSearchState)

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_MODULE, moduleId],
    () =>
      fetchMultipleOffers({
        paramsList: parsedParameters,
        userLocation: position,
        isUserUnderage,
      }),
    { enabled: !!netInfo.isConnected }
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  return useMemo(() => {
    if (!data) return

    const hits = data.hits.filter(filterOfferHit).map(transformHits)
    return {
      hits: uniqBy(hits, 'objectID') as Offer[],
      nbHits: data.nbHits,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, !!position, transformHits])
}
