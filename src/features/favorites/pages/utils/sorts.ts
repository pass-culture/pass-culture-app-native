import { GeoCoordinates } from 'react-native-geolocation-service'

import { FavoriteResponse } from 'api/gen'
import { computeDistanceInMeters } from 'libs/parsers'

export function sortByAscendingPrice(a: FavoriteResponse, b: FavoriteResponse) {
  let aPrice
  let bPrice
  if (a.offer.startPrice !== null) {
    aPrice = a.offer.startPrice
  } else if (a.offer.price !== null) {
    aPrice = a.offer.price
  }
  if (b.offer.startPrice !== null) {
    bPrice = b.offer.startPrice
  } else if (b.offer.price !== null) {
    bPrice = b.offer.price
  }
  if (a.offer.isExpired && b.offer.isExpired) {
    return 0
  } else if (!a.offer.isExpired && b.offer.isExpired) {
    return -1
  } else if (a.offer.isExpired && !b.offer.isExpired) {
    return 1
  } else if (bPrice === undefined && aPrice === undefined) {
    return 0
  } else if (aPrice === undefined && bPrice !== undefined) {
    return 1
  } else if (aPrice !== undefined && bPrice === undefined) {
    return -1
  } else if (aPrice !== undefined && bPrice !== undefined) {
    return aPrice < bPrice ? -1 : 1
  }
  return 0
}

export function sortByIdDesc(a: FavoriteResponse, b: FavoriteResponse) {
  return b.id - a.id
}

export function sortByDistanceAroundMe(position: GeoCoordinates | null) {
  return (a: FavoriteResponse, b: FavoriteResponse) => {
    const aOffer = a.offer
    const bOffer = b.offer
    let aCoordinate
    let bCoordinate
    if (position === null) {
      return 0
    }
    if (aOffer.coordinates?.latitude && aOffer.coordinates?.longitude) {
      aCoordinate = a.offer.coordinates
    }
    if (bOffer.coordinates?.latitude && bOffer.coordinates?.longitude) {
      bCoordinate = b.offer.coordinates
    }
    if (!aCoordinate && !bCoordinate) {
      return -1
    } else if (aCoordinate && !bCoordinate) {
      return -1
    } else if (!aCoordinate && bCoordinate) {
      return 1
    } else if (
      aCoordinate &&
      bCoordinate &&
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
      return distanceToOfferA < distanceToOfferB ? -1 : 1
    }
    return 0
  }
}
