import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StatusBar, Platform } from 'react-native'

import { Bookings } from '../bookings/pages/Bookings'
import { Favorites } from '../favorites/pages/Favorites'
import { HomeNavigator } from '../home/navigation/HomeNavigator'
import { Profile } from '../profile/pages/Profile'
import { Search } from '../search/pages/Search'

import { onNavigationStateChange } from './services'
import { TabBar } from './TabBar/TabBar'

export type RootTabParamList = {
  HomeNavigator: undefined
  Search: undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}
export type RootTabRouteName = keyof RootTabParamList

StatusBar.setBarStyle('light-content')
if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true)
  StatusBar.setBackgroundColor('transparent', false)
}

const RootTab = createBottomTabNavigator<RootTabParamList>()

export const RootTabNavigator: React.FC = () => (
  <NavigationContainer onStateChange={onNavigationStateChange}>
    <RootTab.Navigator
      initialRouteName="HomeNavigator"
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      <RootTab.Screen name="HomeNavigator" component={HomeNavigator} />
      <RootTab.Screen name="Search" component={Search} />
      <RootTab.Screen name="Bookings" component={Bookings} />
      <RootTab.Screen name="Favorites" component={Favorites} />
      <RootTab.Screen name="Profile" component={Profile} />
    </RootTab.Navigator>
  </NavigationContainer>
)
