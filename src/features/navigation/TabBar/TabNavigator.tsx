import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings'
import { withAsyncErrorBoundary } from 'features/errors'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { Profile } from 'features/profile/pages/Profile'
import { Search } from 'features/search/pages/Search'

import { TabBar } from './TabBar'
import { TabParamList } from './types'

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

export const Tab = createBottomTabNavigator<TabParamList>()

const Home = withAsyncErrorBoundary(HomeComponent)

export const TabNavigator: React.FC = () => {
  const authContext = useAuthContext()

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      <Tab.Screen name="Home" component={Home} initialParams={{ shouldDisplayLoginModal: false }} />
      <Tab.Screen name="Search" component={Search} />
      {authContext.isLoggedIn && <Tab.Screen name="Bookings" component={Bookings} />}
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}
