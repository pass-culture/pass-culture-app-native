import type { ReadonlyDeep } from 'type-fest'

import { ScreensUsedByMarketing } from 'features/internal/config/deeplinksExportConfig'
import { ScreenNames } from 'features/navigation/navigators/RootNavigator/types'

const screenTab = [
  'Home',
  'Profile',
  'Favorites',
  'Bookings',
  'SearchStackNavigator',
] as const satisfies ReadonlyDeep<ScreenNames[]>

export type TabScreens = (typeof screenTab)[number]

export const isTabNavigatorScreen = (screen: ScreensUsedByMarketing): screen is TabScreens =>
  screenTab.some((_screen) => _screen === screen)
