import { rootStackNavigatorPathConfig } from 'features/navigation/navigators/RootNavigator/linking/rootStackNavigatorPathConfig'

import { RootScreenNames } from './types'

export const isRootStackScreen = (screen: string): screen is RootScreenNames => {
  return Object.keys(rootStackNavigatorPathConfig.screens).includes(screen as RootScreenNames)
}
