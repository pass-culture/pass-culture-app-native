import {
  calculateHorizontalDistance,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venueMap/helpers/calculateDistanceMap'
import { Position } from 'libs/location/location'
import { Region } from 'libs/maps/maps'

const RADIUS_IN_METERS = 10_000
const DEFAULT_LONGITUDE = 2.3333
const DEFAULT_LATITUDE = 48.8666

export const getRegionFromPosition = (position: Position, screenRatio: number): Region => {
  const longitude = position?.longitude ?? DEFAULT_LONGITUDE
  const latitude = position?.latitude ?? DEFAULT_LATITUDE

  const verticalDistanceInMeters = calculateVerticalDistance(RADIUS_IN_METERS, screenRatio)
  const horizontalDistanceInMeters = calculateHorizontalDistance(RADIUS_IN_METERS, screenRatio)

  const latitudeDelta = distanceToLatitudeDelta(verticalDistanceInMeters)
  const longitudeDelta = distanceToLongitudeDelta(horizontalDistanceInMeters, latitude)

  return {
    longitude,
    latitude,
    latitudeDelta,
    longitudeDelta,
  }
}
