import React from 'react'

import { ThemeProvider } from 'libs/styled'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { theme } from 'theme'
import { useQueryDecorator } from './mocks/react-query'

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

const firestoreResponseMock = { get: () => ({}) }

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
  (Story) => useQueryDecorator(Story,
    { parameters: { useQuery: { featureFlags: firestoreResponseMock }}}
  ),
]
