import { tabStackNavigatorPathConfig } from 'features/navigation/TabBar/TabStackNavigatorPathConfig'
import { TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'

export function isTabScreen(screen): screen is TabRouteName {
  const tabRouteNames = Object.keys(tabStackNavigatorPathConfig.TabNavigator.screens)
  return tabRouteNames.includes(screen)
}
