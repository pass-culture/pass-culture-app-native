import { initialSearchState } from 'features/search/context/reducer'
import { FetchOffersResponse, fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location'

// Radius in meters
const AROUND_RADIUS = 50_000

export const fetchOffersNearMe = async ({
  userLocation,
}: {
  userLocation: Position
}): Promise<FetchOffersResponse> => {
  const offers = await fetchOffers({
    parameters: {
      ...initialSearchState,
      hitsPerPage: 10,
    },
    buildLocationParameterParams: {
      aroundMeRadius: AROUND_RADIUS,
      aroundPlaceRadius: 'all',
      selectedLocationMode: LocationMode.AROUND_ME,
      userLocation,
    },
    isUserUnderage: false,
  })

  if (
    offers.hits.length === 0 &&
    offers.nbHits === 0 &&
    offers.page === 0 &&
    offers.nbPages === 0
  ) {
    // fetchOffers hides errors
    // https://github.com/pass-culture/pass-culture-app-native/blob/566a0f03e395503a79fd74f73e811f2870789c97/src/libs/algolia/fetchAlgolia/fetchOffers.ts#L61-L62
    // retrow to be able to play with status error
    throw new Error()
  }

  return offers
}
