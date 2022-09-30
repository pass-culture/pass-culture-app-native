import React, { useEffect } from 'react'

import { ThemeProvider } from 'libs/styled'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { theme } from 'theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Fondations', 'ui', 'Features'],
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
  (Story) => (
    <SafeAreaProvider>
      <Story />
    </SafeAreaProvider>
  ),
]
