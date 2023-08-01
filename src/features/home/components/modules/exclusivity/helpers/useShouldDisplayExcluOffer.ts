import { useExcluOffer } from 'features/home/api/useExcluOffer'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { ExclusivityModule } from 'features/home/types'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { computeDistanceInMeters } from 'libs/parsers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export function useShouldDisplayExcluOffer(
  displayParameters: ExclusivityModule['displayParameters'],
  offerId: number
) {
  const { position } = useHomePosition()

  const maxPrice = useMaxPrice()
  const { data: offer } = useExcluOffer(offerId)

  if (!offer) return false

  const price = convertCentsToEuros(getOfferPrice(offer.stocks))
  if (price > maxPrice) return false

  // Exclu module is not geolocated
  if (!displayParameters?.isGeolocated || !displayParameters?.aroundRadius) return true

  // Exclu module is geolocated but we don't know the user's location
  if (!position) return false

  // Exclu module is geolocated and we know the user's location: compute distance to offer
  const { latitude, longitude } = offer.venue.coordinates
  if (!latitude || !longitude) return false
  const distance = computeDistanceInMeters(
    latitude,
    longitude,
    position.latitude,
    position.longitude
  )

  return distance <= 1000 * displayParameters.aroundRadius
}
