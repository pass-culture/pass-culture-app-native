import { OfferResponse } from 'api/gen'
import { ExclusivityPane } from 'features/home/contentful'
import { getOfferPrice } from 'features/offer/services/getOfferPrice'
import { GeoCoordinates } from 'libs/geolocation'
import { computeDistanceInMeters } from 'libs/parsers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const shouldDisplayExcluOffer = (
  display: ExclusivityPane['display'],
  offer: OfferResponse | undefined,
  userLocation: GeoCoordinates | null,
  maxPrice: number
): boolean => {
  if (!offer) return false

  const price = convertCentsToEuros(getOfferPrice(offer.stocks))
  if (price > maxPrice) return false

  // Exclu module is not geolocated
  if (!display || !display.isGeolocated || !display.aroundRadius) return true

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

  return distance <= 1000 * display.aroundRadius
}
