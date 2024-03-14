import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

import { routes } from './routes'
import { SearchStack } from './Stack'

export const { screensConfig: searchScreensConfig, Screens: SearchScreens } = getScreensAndConfig(
  routes,
  SearchStack.Screen
)
