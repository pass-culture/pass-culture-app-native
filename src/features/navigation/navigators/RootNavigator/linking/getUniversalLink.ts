import { ScreensUsedByMarketing } from 'features/internal/config/deeplinksExportConfig'
import { getScreenPath } from 'features/navigation/navigators/RootNavigator/linking/getScreenPath'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { isSearchStackScreen } from 'features/navigation/navigators/SearchStackNavigator/isSearchStackScreen'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { isTabNavigatorScreen } from 'features/navigation/TabBar/isTabNavigatorScreen'

export const getUniversalLink = (
  selectedScreen: ScreensUsedByMarketing,
  appAndMarketingParams: Record<string, unknown>,
  domain: string
): string => {
  let screenPath = getScreenPath(selectedScreen, appAndMarketingParams)

  if (isTabNavigatorScreen(selectedScreen)) {
    const tabNavigationConfig = getTabHookConfig(selectedScreen, appAndMarketingParams)
    screenPath = getScreenPath(...tabNavigationConfig)
  }

  if (isSearchStackScreen(selectedScreen)) {
    const searchStackConfig = getSearchHookConfig(selectedScreen, appAndMarketingParams)
    screenPath = getScreenPath(...searchStackConfig)
  }

  return `https://${domain}${screenPath}`
}
