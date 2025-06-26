import { rootStackNavigatorPathConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'

import { SearchStackRouteName } from './SearchStackTypes'

export function isSearchStackScreen(screen): screen is SearchStackRouteName {
  const searchStackRouteNames = Object.keys(
    rootStackNavigatorPathConfig.TabNavigator.screens.SearchStackNavigator.screens
  )
  return searchStackRouteNames.includes(screen)
}
