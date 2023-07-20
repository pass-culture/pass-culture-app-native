import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModuleParameters } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchQueryParameters } from 'libs/algolia'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOfferHits } from 'libs/algolia/fetchAlgolia/fetchOfferHits'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const isSearchQueryParameters = (parameter: unknown): parameter is SearchQueryParameters =>
  typeof parameter === 'object' && parameter !== null

enum QueryMode {
  OFFER_IDS = 'OFFER_IDS',
  MULTIPLE_OFFERS = 'MULTIPLE_OFFERS',
}

const selectQueryMode = (offerIds: string[]) => {
  if (offerIds && offerIds?.length > 0) return QueryMode.OFFER_IDS
  return QueryMode.MULTIPLE_OFFERS
}

export const useVideoOffers = (
  offersModuleParameters: OffersModuleParameters,
  id: string,
  offerIds: string[]
) => {
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { position } = useHomePosition()
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

  const partialAdaptedParameters = adaptPlaylistParameters(offersModuleParameters)
  const adaptedParameters = [partialAdaptedParameters].filter(isSearchQueryParameters)

  const queryMode = selectQueryMode(offerIds, eanList)

  const offersByIdsQuery = async () => {
    const result = await fetchOfferHits({
      objectIds: offerIds,
      isUserUnderage,
    })

    return result
  }

  const multipleOffersQuery = async () => {
    const result = await fetchMultipleOffers({
      paramsList: adaptedParameters,
      userLocation: position,
      isUserUnderage,
    })

    return result.hits
  }
  const queryByQueryMode = {
    [QueryMode.OFFER_IDS]: offersByIdsQuery,
    [QueryMode.MULTIPLE_OFFERS]: multipleOffersQuery,
  }

  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.VIDEO_OFFER, id],
    queryFn: queryByQueryMode[queryMode],
    enabled: !!netInfo.isConnected,
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position])

  const hits = (data?.map(transformHits) as Offer[]) ?? []

  return { offers: hits.slice(0, 9) }
}
