import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'
import { env } from 'libs/environment'

const LINKING_PREFIXES = [
  `https://app.passculture-${env.ENV}.gouv.fr/`,
  `https://*.app.passculture-${env.ENV}.gouv.fr/`,
  'passculture://',
]

const LINKING_CONFIG = {
  initialRouteName: 'TabNavigator',
  screens: {
    Home: '',
    Page1: 'page1',
    TabNavigator: {
      initialRouteName: 'Page3',
      screens: {
        Page2: 'page2',
        Page3: 'page3',
      },
    },
  },
}

const NAVIGATOR_SCREEN_OPTIONS = {
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
    flex: 1,
  },
}

const linking: LinkingOptions = { prefixes: LINKING_PREFIXES, config: LINKING_CONFIG }

const StackNavigator = createStackNavigator()

const Home = () => (
  <Page>
    <Text>Home</Text>
  </Page>
)
const Page1 = () => (
  <Page>
    <Text>Page 1</Text>
  </Page>
)

const routes = [
  { name: 'Home', component: Home },
  { name: 'Page1', component: Page1 },
  { name: 'TabNavigator', component: TabNavigator },
]

export function App() {
  return (
    <AppContainer>
      <AppBackground>
        <AppContent>
          <NavigationContainer linking={linking}>
            <StackNavigator.Navigator
              initialRouteName="Home"
              headerMode="screen"
              screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
              {routes.map((route) => (
                <StackNavigator.Screen
                  name={route.name}
                  component={route.component}
                  key={route.name}
                />
              ))}
            </StackNavigator.Navigator>
          </NavigationContainer>
        </AppContent>
      </AppBackground>
    </AppContainer>
  )
}

const AppContainer = styled.View({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

const AppBackground = styled.View({
  height: '100%',
  maxWidth: '500px',
  maxHeight: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: '#eb0055',
})

const AppContent = styled.View({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
