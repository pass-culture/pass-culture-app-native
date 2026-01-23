import { OfferResponseV2 } from 'api/gen'
import { Position } from 'libs/location/types'

export const getRoundedPosition = (latitude?: number, longitude?: number): Position | undefined => {
  if (latitude === undefined || longitude === undefined) return undefined

  return {
    latitude: Number(latitude.toFixed(3)),
    longitude: Number(longitude.toFixed(3)),
  }
}

export const determineLocation = (userLocation: Position, offer?: OfferResponseV2) => {
  return (
    userLocation ?? {
      latitude: offer?.venue.coordinates.latitude ?? 0,
      longitude: offer?.venue.coordinates.longitude ?? 0,
    }
  )
}
