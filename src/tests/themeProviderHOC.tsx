import React from 'react'

import { ThemeProvider } from 'libs/styled/ThemeProvider'
import { theme } from 'theme'

export function themeProviderHOC(children: JSX.Element | JSX.Element[]) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
