import { OfferResponseV2 } from 'api/gen'
import { useLocation } from 'libs/location/location'
import { Position } from 'libs/location/types'

export const useUserLocation = (offer?: OfferResponseV2) => {
  const { userLocation } = useLocation()

  return getUserLocation(offer, userLocation)
}

export const getUserLocation = (offer?: OfferResponseV2, userLocation?: Position) =>
  userLocation ?? {
    latitude: offer?.venue.coordinates.latitude ?? 0,
    longitude: offer?.venue.coordinates.longitude ?? 0,
  }
