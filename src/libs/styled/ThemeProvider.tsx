import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'

export const ThemeProvider: React.FC<{ theme: DefaultTheme }> = ({ children, theme }) => {
  const { width: windowWidth } = useWindowDimensions()

  const tabletMinWidth = theme.breakpoints.md
  const desktopMinWidth = theme.breakpoints.lg
  const isMobile = useMediaQuery({ maxWidth: tabletMinWidth })
  const isTablet = useMediaQuery({ minWidth: tabletMinWidth, maxWidth: desktopMinWidth })
  const isDesktop = useMediaQuery({ minWidth: desktopMinWidth })

  const appContentWidth = Math.min(desktopMinWidth, windowWidth)

  const computedTheme = useMemo(
    () => ({ ...theme, isMobile, isTablet, isDesktop, appContentWidth }),
    [isMobile, isTablet, isDesktop, appContentWidth]
  )
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
