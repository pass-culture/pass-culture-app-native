import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'

export const ThemeProvider: React.FC<{ theme: DefaultTheme }> = ({ children, theme }) => {
  const { width: windowWidth } = useWindowDimensions()

  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md })
  const isTablet = useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
  const isDesktop = useMediaQuery({ minWidth: theme.breakpoints.lg })

  const APP_CONTENT_MAX_WIDTH = theme.breakpoints.lg
  const appContentWidth = Math.min(APP_CONTENT_MAX_WIDTH, windowWidth)

  const computedTheme = useMemo(
    () => ({ ...theme, isMobile, isTablet, isDesktop, appContentWidth }),
    [isMobile, isTablet, isDesktop, appContentWidth]
  )
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
