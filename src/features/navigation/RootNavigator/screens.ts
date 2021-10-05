import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

import { routes } from './routes'
import { RootStack } from './Stack'

export const { screensConfig: rootScreensConfig, Screens: RootScreens } = getScreensAndConfig(
  routes,
  RootStack.Screen
)
