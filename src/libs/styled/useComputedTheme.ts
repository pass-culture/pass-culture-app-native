import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { BaseAppThemeType, AppThemeType } from 'theme'
import { getSpacing } from 'ui/theme'

export function useComputedTheme(theme: BaseAppThemeType) {
  const enableTabBarV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_TAB_BAR)
  const enableNewOfferTile = true
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
  const tabBarHeight = enableTabBarV2 ? theme.tabBar.heightV2 : theme.tabBar.height
  const appContentWidth = Math.min(desktopMinWidth, windowWidth)
  const offerMaxCaptionHeight = enableNewOfferTile
    ? getSpacing(26)
    : theme.tiles.maxCaptionHeight.offer

  return useMemo<AppThemeType>(
    () => ({
      ...theme,
      tabBar: {
        ...theme.tabBar,
        showLabels,
        height: tabBarHeight,
      },
      tiles: {
        ...theme.tiles,
        maxCaptionHeight: { ...theme.tiles.maxCaptionHeight, offer: offerMaxCaptionHeight },
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
      enableTabBarV2,
      enableNewOfferTile,
    ]
  )
}
