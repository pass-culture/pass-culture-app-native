import { getLocalizationCompliance } from 'features/home/components/modules/business/helpers/getLocalizationCompliance'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { LocationCircleArea } from 'features/home/types'

export function useShouldDisplayBusinessModule(
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean,
  moduleLocationArea?: LocationCircleArea
) {
  const { position: userPosition } = useHomePosition()

  // Target localized users if module is localized (i.e.: latitude, longitude and radius are given in Contentful)
  const isLocalizationCompliant = getLocalizationCompliance(moduleLocationArea, userPosition)

  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined && isLocalizationCompliant) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly && isLocalizationCompliant) return true

  return false
}
