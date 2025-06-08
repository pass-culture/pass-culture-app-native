import React from 'react'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SuspenseSearchStackNavigator } from 'features/navigation/SearchStackNavigator/SuspenseSearchStackNavigator'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/TabNavigatorPathConfig'
import { Profile } from 'features/profile/pages/Profile'

import { TabStack } from './Stack'
import { TabRouteName } from './types'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

export const tabBarRoutesScreens = (
  <React.Fragment>
    <TabStack.Screen name="Home" component={Home} options={{ title: 'Page d’accueil' }} />
    <TabStack.Screen
      name="_DeeplinkOnlyHome1"
      component={Home}
      options={{ title: 'Page d’accueil' }}
    />
    <TabStack.Screen
      name="SearchStackNavigator"
      component={SuspenseSearchStackNavigator}
      options={{ title: 'Mes réservations' }}
    />
    <TabStack.Screen
      name="Bookings"
      component={withAuthProtection(Bookings)}
      options={{ title: 'Mes réservations' }}
    />
    <TabStack.Screen
      name="_DeeplinkOnlyBookings1"
      component={withAuthProtection(Bookings)}
      options={{ title: 'Mes réservations' }}
    />
    <TabStack.Screen name="Favorites" component={Favorites} options={{ title: 'Mes favoris' }} />
    <TabStack.Screen name="Profile" component={Profile} options={{ title: 'Mon profil' }} />
  </React.Fragment>
)

export function isTabScreen(screen): screen is TabRouteName {
  const tabRouteNames = Object.keys(tabNavigatorPathConfig.TabNavigator.screens)
  return tabRouteNames.includes(screen)
}
