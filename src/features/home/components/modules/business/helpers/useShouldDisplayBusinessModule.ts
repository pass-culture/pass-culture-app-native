import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { LocationCircleArea } from 'features/home/types'
import { computeDistanceInMeters } from 'libs/parsers'

export function useShouldDisplayBusinessModule(
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean,
  moduleLocationArea?: LocationCircleArea
) {
  const { position: userPosition } = useHomePosition()

  // Target localized users if module is localized (i.e. : latitude, longitude and radius are given in Contentful)
  let isLocalizationCompliant = true
  if (
    !!moduleLocationArea &&
    !!moduleLocationArea.latitude &&
    !!moduleLocationArea.longitude &&
    !!moduleLocationArea.radius
  ) {
    if (userPosition) {
      const distance = computeDistanceInMeters(
        moduleLocationArea.latitude,
        moduleLocationArea.longitude,
        userPosition.latitude,
        userPosition.longitude
      )
      isLocalizationCompliant = distance <= moduleLocationArea.radius * 1000
    } else {
      isLocalizationCompliant = false
    }
  }

  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined && isLocalizationCompliant) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  return false
}
