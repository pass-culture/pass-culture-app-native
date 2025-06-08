import { tabNavigatorPathConfig } from 'features/navigation/TabBar/TabNavigatorPathConfig'

import { SearchStackRouteName } from './types'

export function isSearchStackScreen(screen): screen is SearchStackRouteName {
  const searchStackRouteNames = Object.keys(
    tabNavigatorPathConfig.TabNavigator.screens.SearchStackNavigator.screens
  )
  return searchStackRouteNames.includes(screen)
}
