import React from 'react'
import { ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { BaseAppThemeType } from 'theme'

import { useComputedTheme } from '../useComputedTheme'

export const ThemeProvider: React.FC<{ theme: BaseAppThemeType; children: React.ReactNode }> = ({
  children,
  theme,
}) => {
  const computedTheme = useComputedTheme(theme)
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
