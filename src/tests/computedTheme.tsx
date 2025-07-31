import { ColorScheme } from 'libs/styled/useColorScheme'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { AppThemeType, theme } from 'theme'

export const computedTheme: Readonly<AppThemeType> = {
  ...theme,
  colorScheme: ColorScheme.LIGHT,
  isMobileViewport: true,
  isTabletViewport: false,
  isDesktopViewport: false,
  appContentWidth: 960,
  showTabBar: true,
  tabBar: {
    ...theme.tabBar,
    showLabels: true,
  },
}
