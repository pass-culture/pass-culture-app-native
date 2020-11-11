import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { Bookings } from '../bookings/pages/Bookings'
import { Favorites } from '../favorites/pages/Favorites'
import { HomeNavigator } from '../home/navigation/HomeNavigator'
import { Profile } from '../profile/pages/Profile'
import { Search } from '../search/pages/Search'

import { onNavigationStateChange } from './services'

export type RootTabParamList = {
  HomeNavigator: undefined
  Search: undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

const RootTab = createBottomTabNavigator<RootTabParamList>()

// temporary here - wait next commit
export const RootTabNavigator: React.FC = () => (
  <NavigationContainer onStateChange={onNavigationStateChange}>
    <RootTab.Navigator initialRouteName="HomeNavigator">
      <RootTab.Screen name="HomeNavigator" component={HomeNavigator} />
      <RootTab.Screen name="Search" component={Search} />
      <RootTab.Screen name="Bookings" component={Bookings} />
      <RootTab.Screen name="Favorites" component={Favorites} />
      <RootTab.Screen name="Profile" component={Profile} />
    </RootTab.Navigator>
  </NavigationContainer>
)
