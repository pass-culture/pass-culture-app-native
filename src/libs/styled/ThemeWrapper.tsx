import React from 'react'

import { ThemeProvider } from 'libs/styled'
import { useColorScheme } from 'libs/styled/useColorScheme'
import { theme } from 'theme'

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  )
}
