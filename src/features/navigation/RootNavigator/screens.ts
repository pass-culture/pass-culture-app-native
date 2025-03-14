import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

import { rootRoutes } from './rootRoutes'
import { RootStack } from './Stack'

export const { screensConfig: rootScreensConfig, Screens: RootScreens } = getScreensAndConfig(
  rootRoutes,
  RootStack.Screen
)
