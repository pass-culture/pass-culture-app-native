import { LocationCircleArea } from 'features/home/types'
import { Position } from 'libs/location/location'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'

export const getLocalizationCompliance = (
  moduleLocationArea?: LocationCircleArea,
  position?: Position
) => {
  if (moduleLocationArea) {
    if (position) {
      const distance = computeDistanceInMeters(
        moduleLocationArea.latitude,
        moduleLocationArea.longitude,
        position.latitude,
        position.longitude
      )
      return distance <= moduleLocationArea.radius * 1000
    } else {
      return false
    }
  }
  return true
}
