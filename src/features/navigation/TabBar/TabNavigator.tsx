import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings'
import { withAsyncErrorBoundary } from 'features/errors'
import { Favorites } from 'features/favorites/pages/Favorites'
import { useUserProfileInfo } from 'features/home/api'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { Profile } from 'features/profile/pages/Profile'
import { Search } from 'features/search/pages/Search'

import { InitialRoutingScreen } from '../RootNavigator/InitialRoutingScreen'

import { shouldDisplayTabIconPredicate } from './helpers'
import { TabBar } from './TabBar'
import { TabParamList, TabRoute } from './types'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

export const Tab = createBottomTabNavigator<TabParamList>()

const Home = withAsyncErrorBoundary(HomeComponent)

export const tabBarRoutes: Array<TabRoute> = [
  {
    name: 'Home',
    component: Home,
    params: { shouldDisplayLoginModal: false },
    key: 'Home-key',
  },
  {
    name: 'Search',
    component: Search,
    key: 'Search-key',
  },
  {
    name: 'Bookings',
    component: Bookings,
    key: 'Bookings-key',
  },
  {
    name: 'Favorites',
    component: Favorites,
    key: 'Favorites-key',
  },
  {
    name: 'Profile',
    component: Profile,
    key: 'Profile-key',
  },
  {
    name: 'InitialRoutingScreen',
    component: InitialRoutingScreen,
    key: 'InitialRoutingScreen-key',
  },
]

export const TabNavigator: React.FC = () => {
  const authContext = useAuthContext()

  const { data: user } = useUserProfileInfo()

  return (
    <Tab.Navigator
      initialRouteName="InitialRoutingScreen"
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      {tabBarRoutes.filter(shouldDisplayTabIconPredicate(authContext, user)).map((route) => (
        <Tab.Screen
          name={route.name}
          component={route.component}
          initialParams={route.params}
          key={route.key}
        />
      ))}
    </Tab.Navigator>
  )
}
