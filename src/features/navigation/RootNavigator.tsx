import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { RootTabNavigator } from './RootTabNavigator'
import { onNavigationStateChange } from './services'

export type RootStackParamList = {
  TabNavigator: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export const navigationRef = React.createRef<NavigationContainerRef>()

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef}>
      <RootStack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TabNavigator" component={RootTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
