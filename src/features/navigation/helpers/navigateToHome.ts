import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'

export function navigateToHome() {
  navigateFromRef(...homeNavigationConfig)
}

export const navigateToHomeConfig = {
  screen: homeNavigationConfig[0],
  params: homeNavigationConfig[1],
  fromRef: true,
}
