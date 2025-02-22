import { useWindowDimensions } from 'react-native'

import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { useLocation } from 'libs/location'
import { Region } from 'libs/maps/maps'

export const useGetDefaultRegion = (): Region => {
  const { userLocation } = useLocation()
  const { height, width } = useWindowDimensions()
  const screenRatio = height / width

  return getRegionFromPosition(userLocation, screenRatio)
}
