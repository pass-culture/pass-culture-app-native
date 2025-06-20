import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React from 'react'

import { TabStack } from 'features/navigation/TabBar/Stack'
import { initialRouteName, TabScreens } from 'features/navigation/TabBar/tabBarRoutes'

import { TabBar } from './TabBar'

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  freezeOnBlur: true,
}

function renderTabBar({ state, navigation }: BottomTabBarProps) {
  return <TabBar navigation={navigation} state={state} />
}

export const TabNavigator: React.FC = () => {
  return (
    <TabStack.Navigator
      initialRouteName={initialRouteName}
      tabBar={renderTabBar}
      screenOptions={TAB_NAVIGATOR_SCREEN_OPTIONS}
      backBehavior="history">
      {TabScreens}
    </TabStack.Navigator>
  )
}
