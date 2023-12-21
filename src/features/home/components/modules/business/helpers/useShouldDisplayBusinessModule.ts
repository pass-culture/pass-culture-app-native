import { getLocalizationCompliance } from 'features/home/components/modules/business/helpers/getLocalizationCompliance'
import { LocationCircleArea } from 'features/home/types'
import { useLocation } from 'libs/location/LocationWrapper'

export function useShouldDisplayBusinessModule(
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean,
  moduleLocationArea?: LocationCircleArea
) {
  const { userLocation: position } = useLocation()

  // Target localized users if module is localized (i.e.: latitude, longitude and radius are given in Contentful)
  const isLocalizationCompliant = getLocalizationCompliance(moduleLocationArea, position)

  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined && isLocalizationCompliant) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  return false
}
