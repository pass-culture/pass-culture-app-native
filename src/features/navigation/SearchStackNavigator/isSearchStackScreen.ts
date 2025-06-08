import { tabStackNavigatorPathConfig } from 'features/navigation/TabBar/TabStackNavigatorPathConfig'

import { SearchStackRouteName } from './SearchStackTypes'

export function isSearchStackScreen(screen): screen is SearchStackRouteName {
  const searchStackRouteNames = Object.keys(
    tabStackNavigatorPathConfig.TabNavigator.screens.SearchStackNavigator.screens
  )
  return searchStackRouteNames.includes(screen)
}
