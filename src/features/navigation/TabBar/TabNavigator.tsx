import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useTheme } from 'styled-components/native'

import { initialRouteName, TabScreens } from 'features/navigation/TabBar/routes'
import { TabStack } from 'features/navigation/TabBar/Stack'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigationStateType } from 'features/navigation/TabBar/types'

import { TabBar } from './TabBar'

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
}

export const TabNavigator: React.FC = () => {
  const { setTabNavigationState } = useTabNavigationContext()
  const theme = useTheme()

  function renderTabBar({ state, navigation }: BottomTabBarProps) {
    setTabNavigationState(state as TabNavigationStateType)
    if (!theme.showTabBar) return null
    return <TabBar navigation={navigation} />
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
