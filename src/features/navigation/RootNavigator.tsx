import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { Login } from 'features/auth/pages/Login'
import AppComponents from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import Navigation from 'features/cheatcodes/pages/Navigation'
import { Home } from 'features/home/pages/Home'

import { onNavigationStateChange } from './services'

export type RootStackParamList = {
  AppComponents: undefined
  Navigation: undefined
  CheatCodes: undefined
  Home: undefined
  IdCheck: undefined
  Login?: { userId: string }
}

const RootStack = createStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = function () {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange}>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen
          name="Login"
          component={Login}
          initialParams={{ userId: 'test_user_id' }}
        />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
        <RootStack.Screen name="AppComponents" component={AppComponents} />
        <RootStack.Screen name="Navigation" component={Navigation} />
        <RootStack.Screen name="IdCheck" component={IdCheck} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
