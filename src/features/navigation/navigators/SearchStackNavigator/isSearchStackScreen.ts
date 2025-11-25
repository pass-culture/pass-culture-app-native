import type { ReadonlyDeep } from 'type-fest'

import { ScreensUsedByMarketing } from 'features/internal/config/deeplinksExportConfig'
import { ScreenNames } from 'features/navigation/navigators/RootNavigator/types'

export const screensSearch = [
  'SearchLanding',
  'SearchResults',
  'ThematicSearch',
] as const satisfies ReadonlyDeep<ScreenNames>[]

export type SearchScreens = (typeof screensSearch)[number]

export const isSearchStackScreen = (screen: ScreensUsedByMarketing) =>
  screensSearch.some((_screen) => _screen === screen)
