import { rootStackNavigatorPathConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'

import { RootScreenNames } from './types'

export const isRootStackScreen = (screen: string | number | symbol): screen is RootScreenNames => {
  const rootScreens = Object.keys(rootStackNavigatorPathConfig)
  return rootScreens.includes(screen)
}
