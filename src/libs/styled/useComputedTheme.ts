import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { ColorSchemeComputed } from 'libs/styled/useColorScheme'
import { BaseAppThemeType, AppThemeType } from 'theme'
import { designTokensDark, designTokensLight } from 'theme/designTokens'

export function useComputedTheme(theme: BaseAppThemeType, colorScheme: ColorSchemeComputed) {
  const { width: windowWidth } = useWindowDimensions()
  const tabletMinWidth = theme.breakpoints.md
  const desktopMinWidth = theme.breakpoints.lg
  const minScreenHeight = theme.minScreenHeight
  const tabBarLabelMinScreenWidth = theme.tabBar.labelMinScreenWidth

  const isMobileViewport = useMediaQuery({ maxWidth: tabletMinWidth })
  const isTabletViewport = useMediaQuery({ minWidth: tabletMinWidth, maxWidth: desktopMinWidth })
  const isDesktopViewport = useMediaQuery({ minWidth: desktopMinWidth })
  const isSmallScreen = useMediaQuery({ maxHeight: minScreenHeight })
  const showLabels = useMediaQuery({ minWidth: tabBarLabelMinScreenWidth })
  const showTabBar = theme.isTouch || !!isMobileViewport
  const appContentWidth = Math.min(desktopMinWidth, windowWidth)

  const designTokens = colorScheme === 'dark' ? designTokensDark : designTokensLight

  return useMemo<AppThemeType>(
    () => ({
      ...theme,
      colorScheme,
      designSystem: designTokens,
      tabBar: { ...theme.tabBar, showLabels, height: theme.tabBar.heightV2 },
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      isSmallScreen,
      showTabBar,
      appContentWidth,
    }),
    [
      theme,
      colorScheme,
      designTokens,
      showLabels,
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      isSmallScreen,
      showTabBar,
      appContentWidth,
    ]
  )
}
