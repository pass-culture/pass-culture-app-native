import { useWindowDimensions } from 'react-native'

import {
  calculateHorizontalDistance,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venueMap/helpers/calculateDistanceMap'
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
    userLocation?.latitude ?? 48.866667
  )

  return {
    latitude: userLocation?.latitude ?? 48.8666,
    longitude: userLocation?.longitude ?? 2.3333,
    latitudeDelta,
    longitudeDelta,
  }
}
