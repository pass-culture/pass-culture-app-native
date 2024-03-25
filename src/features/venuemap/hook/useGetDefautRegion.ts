import { useWindowDimensions } from 'react-native'

import {
  calculateHorizontalDistance,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venuemap/helpers/calculateDistanceMap'
import { useLocation } from 'libs/location'
import { Region } from 'libs/maps/maps'

const RADIUS_IN_METERS = 10_000

export const useGetDefaultRegion = (): Region => {
  const { userLocation } = useLocation()
  const { height, width } = useWindowDimensions()
  const screenRatio = height / width

  const verticalDistanceInMeters = calculateVerticalDistance(RADIUS_IN_METERS, screenRatio)
  const horizontalDistanceInMeters = calculateHorizontalDistance(RADIUS_IN_METERS, screenRatio)

  const latitudeDelta = distanceToLatitudeDelta(verticalDistanceInMeters)
  const longitudeDelta = distanceToLongitudeDelta(
    horizontalDistanceInMeters,
    userLocation?.latitude ?? 0
  )

  return {
    latitude: userLocation?.latitude ?? 0,
    longitude: userLocation?.longitude ?? 0,
    latitudeDelta,
    longitudeDelta,
  }
}
