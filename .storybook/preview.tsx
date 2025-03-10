import React from 'react'
import { Parameters } from '@storybook/react'

import { ThemeProvider } from '../src/libs/styled'
import { SafeAreaProvider } from '../src/libs/react-native-save-area-provider'
import { theme } from '../src/theme'
import { QueryClient, QueryClientProvider } from 'react-query'

const parameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Design System', 'Fondations', 'ui', 'Features'],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme} colorScheme="light">
        <Story />
      </ThemeProvider>
    ),
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default parameters
