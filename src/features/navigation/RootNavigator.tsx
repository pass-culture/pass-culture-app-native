import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { Login } from 'features/auth/pages/Login'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { Home } from 'features/home/pages/Home'

import { onNavigationStateChange } from './services'

export type RootStackParamList = {
  AppComponents: undefined
  Navigation: undefined
  CheatCodes: undefined
  Home: { shouldDisplayLoginModal: boolean }
  IdCheck: undefined
  Login: undefined
}

export const RootStack = createStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = function () {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange}>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen
          name="Home"
          component={Home}
          initialParams={{ shouldDisplayLoginModal: false }}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <RootStack.Screen
          name="CheatCodes"
          component={CheatCodes}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="AppComponents"
          component={AppComponents}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Navigation"
          component={Navigation}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="IdCheck" component={IdCheck} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
