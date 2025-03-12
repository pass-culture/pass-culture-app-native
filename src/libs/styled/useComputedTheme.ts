import { useMemo } from 'react'
import { useColorScheme, useWindowDimensions } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { BaseAppThemeType, AppThemeType } from 'theme'
import { designTokensDark, designTokensLight } from 'theme/designTokens'

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

  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const colorScheme = useColorScheme()
  const isDarkMode = enableDarkMode && colorScheme === 'dark'
  const designTokens = isDarkMode ? designTokensDark : designTokensLight

  return useMemo<AppThemeType>(
    () => ({
      ...theme,
      designSystem: designTokens,
      tabBar: { ...theme.tabBar, showLabels, height: theme.tabBar.heightV2 },
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      isSmallScreen,
      showTabBar,
      appContentWidth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      colorScheme,
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
