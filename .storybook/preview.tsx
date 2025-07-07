import React from 'react'
import { Preview } from '@storybook/react'

import { ThemeProvider } from '../src/libs/styled'
import { SafeAreaProvider } from '../src/libs/react-native-save-area-provider'
import { theme } from '../src/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Design System', 'Fondations', 'ui', 'Features'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
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

export default preview
