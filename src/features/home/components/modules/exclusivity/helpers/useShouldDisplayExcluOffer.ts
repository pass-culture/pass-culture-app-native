import { useExcluOfferQuery } from 'features/home/queries/useExcluOfferQuery'
import { ExclusivityModule } from 'features/home/types'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { useLocation } from 'libs/location/LocationWrapper'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'

export function useShouldDisplayExcluOffer(
  displayParameters: ExclusivityModule['displayParameters'],
  offerId: number
) {
  const { userLocation } = useLocation()

  const maxPrice = useMaxPrice()
  const { data: offer } = useExcluOfferQuery(offerId)

  if (!offer) return false

  const price = getOfferPrice(offer.stocks)
  if (price > maxPrice) return false

  // Exclu module is not geolocated
  if (!displayParameters?.isGeolocated || !displayParameters?.aroundRadius) return true

  // Exclu module is geolocated but we don't know the user's location
  if (!userLocation) return false

  // Exclu module is geolocated and we know the user's location: compute distance to offer
  const { latitude, longitude } = offer.venue.coordinates
  if (!latitude || !longitude) return false
  const distance = computeDistanceInMeters(
    latitude,
    longitude,
    userLocation.latitude,
    userLocation.longitude
  )

  return distance <= 1000 * displayParameters.aroundRadius
}
