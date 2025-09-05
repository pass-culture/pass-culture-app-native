import React from 'react'
import { Preview } from '@storybook/react-vite'

import { ThemeProvider } from '../src/libs/styled'
import { SafeAreaProvider } from '../src/libs/react-native-save-area-provider'
import { theme } from '../src/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { styled } from 'styled-components/native'

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
    (Story) => <NavigationContainerWithScreen component={Story} />,
  ],
}

const Stack = createStackNavigator()

const NavigationContainerWithScreen = (props: { component: React.ComponentType }) => {
  const { component: Component } = props

  return (
    <NavigationContainer>
      <Container>
        <Stack.Navigator
          initialRouteName="Story"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.designSystem.color.background.default },
          }}>
          <Stack.Screen name="Story" component={Component} />
        </Stack.Navigator>
      </Container>
    </NavigationContainer>
  )
}

const Container = styled.View({ height: '100vh' })

export default preview
