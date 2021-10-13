import React, { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

export function ThemeProvider({
  children,
  theme,
}: {
  children: JSX.Element | JSX.Element[]
  theme: DefaultTheme
}) {
  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md })
  const isTablet = useMediaQuery({
    minWidth: theme.breakpoints.md,
    maxWidth: theme.breakpoints.lg,
  })
  const isDesktop = useMediaQuery({ minWidth: theme.breakpoints.lg })

  const computedTheme = useMemo(() => ({ ...theme, isMobile, isTablet, isDesktop }), [
    isMobile,
    isTablet,
    isDesktop,
  ])
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
