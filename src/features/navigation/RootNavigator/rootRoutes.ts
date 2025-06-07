import { temporaryRootStackConfig } from 'features/navigation/RootNavigator/linking/temporaryRootStackConfig'

import { RootRoute, RootScreenNames } from './types'

export const rootRoutes: RootRoute[] = []

export function isRootStackScreen(screen: string): screen is RootScreenNames {
  const screensRemovedFromRootRoutes = Object.keys(temporaryRootStackConfig)
  const rootStackRouteNames = rootRoutes.map((route): string => route.name)
  return [...rootStackRouteNames, ...screensRemovedFromRootRoutes].includes(screen)
}
