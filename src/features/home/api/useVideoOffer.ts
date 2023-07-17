import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModuleParameters } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchParametersQuery } from 'libs/algolia'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const isSearchParametersQuery = (parameter: unknown): parameter is SearchParametersQuery =>
  typeof parameter === 'object' && parameter !== null

export const useVideoOffers = (offersModuleParameters: OffersModuleParameters, id: string) => {
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { position } = useHomePosition()
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const partialAdaptedParameters = adaptPlaylistParameters(offersModuleParameters)
  const adaptedParameters = [partialAdaptedParameters].filter(isSearchParametersQuery)

  const { data, refetch } = useQuery(
    [QueryKeys.VIDEO_OFFER, id],
    () =>
      fetchMultipleOffers({
        paramsList: adaptedParameters,
        userLocation: position,
        isUserUnderage,
      }),
    { enabled: !!netInfo.isConnected }
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position])

  const hits = (data?.hits.map(transformHits) as Offer[]) ?? []

  return { offers: hits.slice(0, 9) }
}
