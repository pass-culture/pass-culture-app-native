import { FavoriteOfferResponseV2 } from 'api/gen'
import { Position } from 'libs/location/location'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'

function getOfferPrice({ offer }: FavoriteOfferResponseV2): number | null {
  return offer.startPrice ?? offer.price ?? null
}

export function sortByAscendingPrice(a: FavoriteOfferResponseV2, b: FavoriteOfferResponseV2) {
  // If only offer is expired, we rank it last.
  if (a.offer.isExpired && !b.offer.isExpired) return 1
  if (!a.offer.isExpired && b.offer.isExpired) return -1

  const aPrice = getOfferPrice(a)
  const bPrice = getOfferPrice(b)

  if (aPrice === null && bPrice === null) return 0
  if (!aPrice && aPrice !== 0) return 1
  if (!bPrice && bPrice !== 0) return -1

  return aPrice - bPrice
}

export function sortByIdDesc(a: FavoriteOfferResponseV2, b: FavoriteOfferResponseV2) {
  return b.id - a.id
}

export function sortByDistanceAroundMe(position: Position) {
  return (a: FavoriteOfferResponseV2, b: FavoriteOfferResponseV2) => {
    if (!position) return 0

    let aCoordinate, bCoordinate
    if (a.offer.coordinates?.latitude && a.offer.coordinates?.longitude) {
      aCoordinate = a.offer.coordinates
    }
    if (b.offer.coordinates?.latitude && b.offer.coordinates?.longitude) {
      bCoordinate = b.offer.coordinates
    }

    if (!aCoordinate && !bCoordinate) return 0
    if (!aCoordinate) return 1
    if (!bCoordinate) return -1

    if (
      aCoordinate.latitude &&
      aCoordinate.longitude &&
      bCoordinate.latitude &&
      bCoordinate.longitude
    ) {
      const distanceToOfferA = computeDistanceInMeters(
        aCoordinate.latitude,
        aCoordinate.longitude,
        position.latitude,
        position.longitude
      )
      const distanceToOfferB = computeDistanceInMeters(
        bCoordinate.latitude,
        bCoordinate.longitude,
        position.latitude,
        position.longitude
      )
      return distanceToOfferA - distanceToOfferB
    }

    return 0
  }
}
