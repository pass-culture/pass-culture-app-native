import { culturalSurveyRoutes } from 'features/navigation/RootNavigator/culturalSurveyRoutes'
import { temporaryRootStackConfig } from 'features/navigation/RootNavigator/linking/temporaryRootStackConfig'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import { trustedDeviceRoutes } from 'features/navigation/RootNavigator/trustedDeviceRoutes'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/tabBarRoutes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'

import { RootRoute, RootScreenNames } from './types'

export const rootRoutes: RootRoute[] = [
  ...culturalSurveyRoutes,
  ...subscriptionRoutes,
  ...trustedDeviceRoutes,
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
]

export function isRootStackScreen(screen: string): screen is RootScreenNames {
  const screensRemovedFromRootRoutes = Object.keys(temporaryRootStackConfig)
  const rootStackRouteNames = rootRoutes.map((route): string => route.name)
  return [...rootStackRouteNames, ...screensRemovedFromRootRoutes].includes(screen)
}
