import { LocationCircleArea } from 'features/home/types'
import { Position } from 'libs/location'
import { computeDistanceInMeters } from 'libs/parsers'

export const getLocalizationCompliance = (
  moduleLocationArea?: LocationCircleArea,
  userPosition?: Position
) => {
  if (moduleLocationArea) {
    if (userPosition) {
      const distance = computeDistanceInMeters(
        moduleLocationArea.latitude,
        moduleLocationArea.longitude,
        userPosition.latitude,
        userPosition.longitude
      )
      return distance <= moduleLocationArea.radius * 1000
    } else {
      return false
    }
  }
  return true
}
