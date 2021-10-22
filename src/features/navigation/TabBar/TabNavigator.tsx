import { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

import { initialRouteName, TabScreens } from 'features/navigation/TabBar/routes'
import { TabStack } from 'features/navigation/TabBar/Stack'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigationStateType } from 'features/navigation/TabBar/types'
import { IS_WEB_RELEASE } from 'libs/web'

import { TabBar } from './TabBar'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

export const TabNavigator: React.FC = () => {
  const { setTabNavigationState } = useTabNavigationContext()
  const { isMobile } = useTheme()

  function renderTabBar({ state, navigation }: BottomTabBarProps<BottomTabBarOptions>) {
    setTabNavigationState(state as TabNavigationStateType)
    if (IS_WEB_RELEASE) return undefined
    return <TabBar navigation={navigation} hidden={Platform.OS === 'web' && !isMobile} />
  }

  return (
    <TabStack.Navigator initialRouteName={initialRouteName} tabBar={renderTabBar}>
      {TabScreens}
    </TabStack.Navigator>
  )
}
