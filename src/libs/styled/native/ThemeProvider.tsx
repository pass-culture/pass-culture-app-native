import React, { FunctionComponent } from 'react'
import { ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { ColorSchemeComputed } from 'libs/styled/useColorScheme'
import { BaseAppThemeType } from 'theme'

import { useComputedTheme } from '../useComputedTheme'

export type ThemeProviderProps = {
  theme: BaseAppThemeType
  children: React.ReactNode
  colorScheme: ColorSchemeComputed
}

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
  theme,
  colorScheme,
}) => {
  const computedTheme = useComputedTheme(theme, colorScheme)
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
