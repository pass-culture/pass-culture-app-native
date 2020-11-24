import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { onNavigationStateChange } from './services'
import { TabNavigator } from './TabBar/TabNavigator'

export type RootStackParamList = {
  TabNavigator: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export const navigationRef = React.createRef<NavigationContainerRef>()

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef}>
      <RootStack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
