import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { BaseAppThemeType, AppThemeType } from 'theme'

export function useComputedTheme(theme: BaseAppThemeType) {
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

  return useMemo<AppThemeType>(
    () => ({
      ...theme,
      tabBar: {
        ...theme.tabBar,
        showLabels,
      },
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      isSmallScreen,
      showTabBar,
      appContentWidth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      isSmallScreen,
      showLabels,
      showTabBar,
      appContentWidth,
    ]
  )
}
