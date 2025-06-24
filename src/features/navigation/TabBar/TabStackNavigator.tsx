import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React from 'react'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home } from 'features/home/pages/Home'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SuspenseSearchStackNavigator } from 'features/navigation/SearchStackNavigator/SuspenseSearchStackNavigator'
import { TabStackNavigatorBase } from 'features/navigation/TabBar/TabStackNavigatorBase'
import { Profile } from 'features/profile/pages/Profile'

import { TabBar } from './TabBar'

const initialRouteName = 'Home'

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  freezeOnBlur: true,
}

function renderTabBar({ state, navigation }: BottomTabBarProps) {
  return <TabBar navigation={navigation} state={state} />
}

export const TabNavigator: React.FC = () => {
  return (
    <TabStackNavigatorBase.Navigator
      initialRouteName={initialRouteName}
      tabBar={renderTabBar}
      screenOptions={TAB_NAVIGATOR_SCREEN_OPTIONS}
      backBehavior="history">
      <TabStackNavigatorBase.Screen
        name="Home"
        component={withAsyncErrorBoundary(Home)}
        options={{ title: 'Page d’accueil' }}
      />
      <TabStackNavigatorBase.Screen
        name="_DeeplinkOnlyHome1"
        component={withAsyncErrorBoundary(Home)}
        options={{ title: 'Page d’accueil' }}
      />
      <TabStackNavigatorBase.Screen
        name="SearchStackNavigator"
        component={SuspenseSearchStackNavigator}
        options={{ title: 'Mes réservations' }}
      />
      <TabStackNavigatorBase.Screen
        name="Bookings"
        component={withAsyncErrorBoundary(withAuthProtection(Bookings))}
        options={{ title: 'Mes réservations' }}
      />
      <TabStackNavigatorBase.Screen
        name="_DeeplinkOnlyBookings1"
        component={withAsyncErrorBoundary(withAuthProtection(Bookings))}
        options={{ title: 'Mes réservations' }}
      />
      <TabStackNavigatorBase.Screen
        name="Favorites"
        component={withAsyncErrorBoundary(Favorites)}
        options={{ title: 'Mes favoris' }}
      />
      <TabStackNavigatorBase.Screen
        name="Profile"
        component={withAsyncErrorBoundary(Profile)}
        options={{ title: 'Mon profil' }}
      />
    </TabStackNavigatorBase.Navigator>
  )
}
