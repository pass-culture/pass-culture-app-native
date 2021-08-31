import {
  BottomTabBarOptions,
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { initialRouteName, routes } from 'features/navigation/TabBar/routes'
import { IS_WEB_RELEASE } from 'libs/web'

import { shouldDisplayTabIconPredicate } from './helpers'
import { TabBar } from './TabBar'
import { TabParamList } from './types'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

export const { Navigator, Screen } = createBottomTabNavigator<TabParamList>()

function renderTabBar(props: BottomTabBarProps<BottomTabBarOptions>) {
  if (IS_WEB_RELEASE) {
    return undefined
  }
  return <TabBar state={props.state} navigation={props.navigation} />
}

export const TabNavigator: React.FC = () => {
  const authContext = useAuthContext()
  const { data: user } = useUserProfileInfo()
  return (
    <Navigator initialRouteName={initialRouteName} tabBar={renderTabBar}>
      {routes.filter(shouldDisplayTabIconPredicate(authContext, user)).map((route) => (
        <Screen
          name={route.name}
          component={route.component}
          options={route.options}
          key={route.name}
        />
      ))}
    </Navigator>
  )
}
