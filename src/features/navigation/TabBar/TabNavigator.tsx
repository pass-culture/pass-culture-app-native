import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { initialRouteName, routes } from 'features/navigation/TabBar/routes'

import { shouldDisplayTabIconPredicate } from './helpers'
import { TabBar } from './TabBar'
import { TabParamList } from './types'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

export const { Navigator, Screen } = createBottomTabNavigator<TabParamList>()

export const TabNavigator: React.FC = () => {
  const authContext = useAuthContext()

  const { data: user } = useUserProfileInfo()

  return (
    <Navigator
      initialRouteName={initialRouteName}
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      {routes.filter(shouldDisplayTabIconPredicate(authContext, user)).map((route) => (
        <Screen
          name={route.name}
          component={route.component}
          initialParams={route.params}
          key={route.key}
        />
      ))}
    </Navigator>
  )
}
