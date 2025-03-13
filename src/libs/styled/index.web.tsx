import React, { FunctionComponent } from 'react'
import { ThemeProvider as ThemeProviderWeb } from 'styled-components'

import { useComputedTheme } from 'libs/styled/useComputedTheme'

import { ThemeProvider as ThemeProviderNative, ThemeProviderProps } from './native/ThemeProvider'

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
  theme,
  colorScheme,
}) => {
  const computedTheme = useComputedTheme(theme, colorScheme)
  return (
    <ThemeProviderWeb theme={computedTheme}>
      <ThemeProviderNative theme={computedTheme} colorScheme={colorScheme}>
        {children}
      </ThemeProviderNative>
    </ThemeProviderWeb>
  )
}
