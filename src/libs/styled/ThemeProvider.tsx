import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'

export const ThemeProvider: React.FC<{ theme: DefaultTheme }> = ({ children, theme }) => {
  const { width: windowWidth } = useWindowDimensions()
  const tabletMinWidth = theme.breakpoints.md
  const desktopMinWidth = theme.breakpoints.lg

  const isMobileViewport = useMediaQuery({ maxWidth: tabletMinWidth })
  const isTabletViewport = useMediaQuery({ minWidth: tabletMinWidth, maxWidth: desktopMinWidth })
  const isDesktopViewport = useMediaQuery({ minWidth: desktopMinWidth })
  const showTabbar = theme.isTouch || isMobileViewport
  const appContentWidth = Math.min(desktopMinWidth, windowWidth)

  const computedTheme = useMemo(
    () => ({
      ...theme,
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      showTabbar,
      appContentWidth,
    }),
    [isMobileViewport, isTabletViewport, isDesktopViewport, showTabbar, appContentWidth]
  )

  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
