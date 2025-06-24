import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React from 'react'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home } from 'features/home/pages/Home'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SuspenseSearchStackNavigator } from 'features/navigation/SearchStackNavigator/SuspenseSearchStackNavigator'
import { TabStackNavigatorBase } from 'features/navigation/TabBar/TabStackNavigatorBase'
import { TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { Profile } from 'features/profile/pages/Profile'

import { TabBar } from './TabBar'

const initialRouteName = 'Home'

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  freezeOnBlur: true,
}

type TabRouteConfig = {
  name: TabRouteName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options: BottomTabNavigationOptions
}

const tabScreens: TabRouteConfig[] = [
  { name: 'Home', component: Home, options: { title: 'Page d’accueil' } },
  { name: '_DeeplinkOnlyHome1', component: Home, options: { title: 'Page d’accueil' } },
  {
    name: 'Bookings',
    component: withAuthProtection(Bookings),
    options: { title: 'Mes réservations' },
  },
  {
    name: '_DeeplinkOnlyBookings1',
    component: withAuthProtection(Bookings),
    options: { title: 'Mes réservations' },
  },
  { name: 'Favorites', component: Favorites, options: { title: 'Mes favoris' } },
  { name: 'Profile', component: Profile, options: { title: 'Mon profil' } },
]

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
      {tabScreens.map(({ name, component, options }) => (
        <TabStackNavigatorBase.Screen
          key={name}
          name={name}
          component={withAsyncErrorBoundary(component)}
          options={options}
        />
      ))}
      <TabStackNavigatorBase.Screen
        name="SearchStackNavigator"
        component={SuspenseSearchStackNavigator}
        options={{ title: 'Mes réservations' }}
      />
    </TabStackNavigatorBase.Navigator>
  )
}
