import { rootStackNavigatorPathConfig } from 'features/navigation/navigators/RootNavigator/linking/rootStackNavigatorPathConfig'

import { RootScreenNames } from './types'

export const isRootStackScreen = (screen: string): screen is RootScreenNames => {
  const rootGroupsScreens: string[] = Object.keys(rootStackNavigatorPathConfig.screens.groups)
    .map((groupkey) => Object.keys(rootStackNavigatorPathConfig.screens.groups[groupkey].screens))
    .flat()

  const allRootScreens = [...rootGroupsScreens.flat()]
  return allRootScreens.includes(screen)
}
