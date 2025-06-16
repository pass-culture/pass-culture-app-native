import { rootStackNavigatorPathConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'

import { RootScreenNames } from './types'

export function isRootStackScreen(screen: string): screen is RootScreenNames {
  const rootScreens = Object.keys(rootStackNavigatorPathConfig)
  return screen in rootScreens
}
