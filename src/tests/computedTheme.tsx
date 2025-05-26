import { AppThemeType, theme } from 'theme'

export const computedTheme: Readonly<AppThemeType> = {
  ...theme,
  colorScheme: 'light',
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
