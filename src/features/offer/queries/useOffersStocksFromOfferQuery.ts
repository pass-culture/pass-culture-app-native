import { Hit } from '@algolia/client-search'

import { OfferResponseV2 } from 'api/gen'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'
import { useFetchOffersQuery } from 'features/offer/queries/useFetchOffersQuery'
import { useOffersStocksQuery } from 'features/offer/queries/useOffersStocksQuery'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchQueryParameters } from 'libs/algolia/types'
import { LocationMode } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

const DEFAULT_RADIUS_KM = 50

export const useOffersStocksFromOfferQuery = (
  offer: OfferResponseV2,
  radiusKm = DEFAULT_RADIUS_KM
) => {
  const userLocation = useUserLocation(offer)
  const isUserUnderage = useIsUserUnderage()

  let searchQueryParameters: SearchQueryParameters = {
    ...initialSearchState,
    distinct: false,
  }

  const allocineId = offer?.extraData?.allocineId ?? undefined
  if (allocineId) {
    searchQueryParameters = { ...searchQueryParameters, allocineId }
  } else if (offer?.id) {
    searchQueryParameters = { ...searchQueryParameters, objectIds: [offer.id.toString()] }
  }

  const { data } = useFetchOffersQuery({
    parameters: searchQueryParameters,
    buildLocationParameterParams: {
      userLocation,
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: radiusKm ?? 'all',
      aroundPlaceRadius: 'all',
    },
    isUserUnderage,
  })

  const offerIds = extractOfferIdsFromHits(data?.hits)

  const offersStocks = useOffersStocksQuery({ offerIds })

  return { ...offersStocks, data: offersStocks.data ?? { offers: [] } }
}

const extractOfferIdsFromHits = (hits: Hit<Offer>[] | undefined) => {
  if (!hits) {
    return []
  }
  return hits.reduce<number[]>((previous, current) => [...previous, +current.objectID], [])
}
