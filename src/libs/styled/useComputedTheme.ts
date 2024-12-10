import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { BaseAppThemeType, AppThemeType } from 'theme'
import { getSpacing } from 'ui/theme'

const OFFER_TILE_MAX_LINES =
  1 + // category
  2 + // title
  1 + // date
  1 // price

const OFFER_TILE_GAP = getSpacing(1)

export function useComputedTheme(theme: BaseAppThemeType) {
  const enableTabBarV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_TAB_BAR)
  const enableNewOfferTile = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)
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
  const maxCaptionHeightOfferTile =
    parseFloat(theme.designSystem.typography.bodyAccentXs.lineHeight) * OFFER_TILE_MAX_LINES +
    OFFER_TILE_GAP

  const offerMaxCaptionHeight = enableNewOfferTile
    ? maxCaptionHeightOfferTile
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
