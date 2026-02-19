import React from 'react'
import { Preview } from '@storybook/react-vite'

import { createGlobalStyle } from 'styled-components'

import { ThemeProvider } from '../src/libs/styled'
import { ColorScheme } from '../src/libs/styled/types'
import { SafeAreaProvider } from '../src/libs/react-native-save-area-provider'
import type { AppThemeType } from '../src/theme'
import { theme } from '../src/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      name: 'Color scheme',
      description: 'Switch between light and dark theme',
      defaultValue: ColorScheme.LIGHT,
      toolbar: {
        icon: 'mirror',
        items: [
          { value: ColorScheme.LIGHT, title: 'Light' },
          { value: ColorScheme.DARK, title: 'Dark' },
        ],
      },
    },
  },
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
    (Story, context) => (
      <ThemeProvider theme={theme} colorScheme={context.globals.colorScheme}>
        <GlobalStyle />
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
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}

export default preview

const GlobalStyle = createGlobalStyle<{ theme?: AppThemeType }>`
  body,
  #storybook-root,
  .sb-show-main,
  .sb-main-padded {
    background-color: ${({ theme }) =>
      theme?.designSystem.color.background.default ?? 'transparent'};
  }
`
