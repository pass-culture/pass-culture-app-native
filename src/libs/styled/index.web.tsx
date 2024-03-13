import React, { ReactNode } from 'react'
import { ThemeProvider as ThemeProviderWeb } from 'styled-components'

import { useComputedTheme } from 'libs/styled/useComputedTheme'
import { AppThemeType } from 'theme'

import { ThemeProvider as ThemeProviderNative } from './native/ThemeProvider'

type Props = {
  children: ReactNode
  theme: AppThemeType
}

export function ThemeProvider({ children, theme }: Props) {
  const computedTheme = useComputedTheme(theme)
  return (
    <ThemeProviderWeb theme={computedTheme}>
      <ThemeProviderNative theme={computedTheme}>{children}</ThemeProviderNative>
    </ThemeProviderWeb>
  )
}
