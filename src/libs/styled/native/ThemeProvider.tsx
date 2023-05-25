import React from 'react'
import { DefaultTheme, ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { useComputedTheme } from '../useComputedTheme'

export const ThemeProvider: React.FC<{ theme: DefaultTheme; children: React.ReactNode }> = ({
  children,
  theme,
}) => {
  const computedTheme = useComputedTheme<DefaultTheme>(theme)
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
