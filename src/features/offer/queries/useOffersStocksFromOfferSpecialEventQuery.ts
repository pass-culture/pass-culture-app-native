import { useQueryClient } from '@tanstack/react-query'
import { Hit } from 'algoliasearch/lite'

import { OfferResponse } from 'api/gen'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'
import { useFetchOffersQuery } from 'features/offer/queries/useFetchOffersQuery'
import { useOffersStocksSpecialEventQuery } from 'features/offer/queries/useOffersStocksSpecialEventQuery'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchQueryParameters } from 'libs/algolia/types'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const DEFAULT_RADIUS_KM = 50

export const useOffersStocksFromOfferSpecialEventQuery = (
  offer: OfferResponse,
  radiusKm = DEFAULT_RADIUS_KM
) => {
  const userLocation = useUserLocation(offer)
  const isUserUnderage = useIsUserUnderage()

  const isOfferPreview = useQueryClient().getQueryData([
    QueryKeys.OFFER,
    QueryKeys.PREVIEW,
    offer.id,
  ])

  let searchQueryParameters: SearchQueryParameters = {
    ...initialSearchState,
    distinct: false,
  }

  const allocineId = offer.extraData?.allocineId ?? undefined
  if (allocineId) {
    searchQueryParameters = { ...searchQueryParameters, allocineId }
  } else {
    searchQueryParameters = { ...searchQueryParameters, objectIds: [offer.id.toString()] }
  }

  const { data: offerIds = [] } = useFetchOffersQuery(
    {
      parameters: searchQueryParameters,
      buildLocationParameterParams: {
        userLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: radiusKm,
        aroundPlaceRadius: 'all',
      },
      isUserUnderage,
    },
    {
      enabled: !isOfferPreview,
      select: (data) => extractOfferIdsFromHits(data.hits),
    }
  )

  const offersStocks = useOffersStocksSpecialEventQuery(
    { offerIds: offerIds },
    {
      enabled: !isOfferPreview,
    }
  )

  return { ...offersStocks, data: offersStocks.data ?? { offers: [] } }
}

const extractOfferIdsFromHits = (hits: Hit<Offer>[] = []) =>
  hits.reduce<number[]>((previous, current) => [...previous, +current.objectID], [])
