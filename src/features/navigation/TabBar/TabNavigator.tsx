import { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { initialRouteName, TabScreens } from 'features/navigation/TabBar/routes'
import { TabStack } from 'features/navigation/TabBar/Stack'
import { IS_WEB_RELEASE } from 'libs/web'

import { shouldDisplayTabIconPredicate } from './helpers'
import { TabBar } from './TabBar'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

function renderTabBar(props: BottomTabBarProps<BottomTabBarOptions>) {
  if (IS_WEB_RELEASE) {
    return undefined
  }
  return <TabBar state={props.state} navigation={props.navigation} />
}

export const TabNavigator: React.FC = () => {
  const { isLoggedIn } = useAuthContext()
  const { data: user } = useUserProfileInfo()

  const shouldDisplayTabIcon = shouldDisplayTabIconPredicate(isLoggedIn, user?.isBeneficiary)
  const FilteredTabScreens = TabScreens.filter((jsxElement) =>
    shouldDisplayTabIcon(jsxElement.props.name)
  )
  return (
    <TabStack.Navigator initialRouteName={initialRouteName} tabBar={renderTabBar}>
      {FilteredTabScreens}
    </TabStack.Navigator>
  )
}
