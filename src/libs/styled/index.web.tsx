import React, { ReactNode } from 'react'
import {
  DefaultTheme as DefaultThemeWeb,
  ThemeProvider as ThemeProviderWeb,
} from 'styled-components'

import { useComputedTheme } from 'libs/styled/useComputedTheme'

import { ThemeProvider as ThemeProviderNative } from './native/ThemeProvider'
import { ComputedTheme } from './web/types.web'

type Props = {
  children: ReactNode
  theme: ComputedTheme
}

export function ThemeProvider({ children, theme }: Props) {
  const computedTheme = useComputedTheme<DefaultThemeWeb>(theme)
  return (
    <ThemeProviderWeb theme={computedTheme}>
      <ThemeProviderNative theme={computedTheme}>{children}</ThemeProviderNative>
    </ThemeProviderWeb>
  )
}
