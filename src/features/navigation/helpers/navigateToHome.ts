import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export function navigateToHome() {
  navigateFromRef(...homeNavConfig)
}

export const navigateToHomeConfig = {
  screen: homeNavConfig[0],
  params: homeNavConfig[1],
  fromRef: true,
}
