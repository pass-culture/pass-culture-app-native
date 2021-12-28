import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'

export type ComputedTheme = DefaultTheme & {
  isMobileViewport?: boolean
  isTabletViewport?: boolean
  isDesktopViewport?: boolean
  showTabBar: boolean
  appContentWidth: number
}

export const ThemeProvider: React.FC<{ theme: DefaultTheme }> = ({ children, theme }) => {
  const { width: windowWidth } = useWindowDimensions()
  const tabletMinWidth = theme.breakpoints.md
  const desktopMinWidth = theme.breakpoints.lg

  const isMobileViewport = useMediaQuery({ maxWidth: tabletMinWidth })
  const isTabletViewport = useMediaQuery({ minWidth: tabletMinWidth, maxWidth: desktopMinWidth })
  const isDesktopViewport = useMediaQuery({ minWidth: desktopMinWidth })
  const showTabBar = theme.isTouch || !!isMobileViewport
  const appContentWidth = Math.min(desktopMinWidth, windowWidth)

  const computedTheme = useMemo<ComputedTheme>(
    () => ({
      ...theme,
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      showTabBar,
      appContentWidth,
    }),
    [isMobileViewport, isTabletViewport, isDesktopViewport, showTabBar, appContentWidth]
  )

  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
