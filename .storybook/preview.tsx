import React from 'react'

import { ThemeProvider } from '../src/libs/styled'
import { SafeAreaProvider } from '../src/libs/react-native-save-area-provider'
import { theme } from '../src/theme'
import { useQueryDecorator } from './mocks/react-query'
import { QueryClient, QueryClientProvider } from 'react-query'

const parameters = {
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
      <ThemeProvider theme={theme}>
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
    (Story) =>
      useQueryDecorator(Story, {
        parameters: { useQuery: { featureFlags: firestoreResponseMock } },
      }),
  ],
}

export default parameters

const firestoreResponseMock = { get: () => ({}) }
