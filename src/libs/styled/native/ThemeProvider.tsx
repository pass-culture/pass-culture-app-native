import React, { FunctionComponent } from 'react'
import { ColorSchemeName } from 'react-native'
import { ThemeProvider as DefaultThemeProvider } from 'styled-components/native'

import { BaseAppThemeType } from 'theme'

import { useComputedTheme } from '../useComputedTheme'

export type ThemeProviderProps = {
  theme: BaseAppThemeType
  children: React.ReactNode
  colorScheme: ColorSchemeName
}

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
  theme,
  colorScheme,
}) => {
  const computedTheme = useComputedTheme(theme, colorScheme)
  return <DefaultThemeProvider theme={computedTheme}>{children}</DefaultThemeProvider>
}
