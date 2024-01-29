import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React from 'react'

import { initialRouteName, TabScreens } from 'features/navigation/TabBar/routes'
import { TabStack } from 'features/navigation/TabBar/Stack'

import { TabBar } from './TabBar'

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
}

export const TabNavigator: React.FC = () => {
  function renderTabBar({ state, navigation }: BottomTabBarProps) {
    return <TabBar navigation={navigation} state={state} />
  }

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
