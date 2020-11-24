import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'

import { Bookings } from '../../bookings/pages/Bookings'
import { Favorites } from '../../favorites/pages/Favorites'
import { HomeNavigator } from '../../home/navigation/HomeNavigator'
import { Profile } from '../../profile/pages/Profile'
import { Search } from '../../search/pages/Search'

import { TabBar } from './TabBar'

export type TabParamList = {
  HomeNavigator: undefined
  Search: undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}
export type TabRouteName = keyof TabParamList

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

const Tab = createBottomTabNavigator<TabParamList>()

export const TabNavigator: React.FC = () => {
  const authContext = useAuthContext()

  return (
    <Tab.Navigator
      initialRouteName="HomeNavigator"
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      <Tab.Screen name="HomeNavigator" component={HomeNavigator} />
      <Tab.Screen name="Search" component={Search} />
      {authContext.isLoggedIn && <Tab.Screen name="Bookings" component={Bookings} />}
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}
