import { rootStackNavigatorPathConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'
import { TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'

export function isTabNavigatorScreen(screen): screen is TabRouteName {
  const tabRouteNames = Object.keys(rootStackNavigatorPathConfig.TabNavigator.screens)
  return tabRouteNames.includes(screen)
}
