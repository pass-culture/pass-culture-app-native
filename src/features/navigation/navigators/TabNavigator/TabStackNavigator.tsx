import {
  BottomTabNavigationEventMap,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
  createComponentForStaticNavigation,
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home } from 'features/home/pages/Home'
import { screenParamsParser } from 'features/navigation/helpers/screenParamsUtils'
import { SearchStackScreen } from 'features/navigation/navigators/SearchStackNavigator/SearchStackNavigator'
import { TabBar } from 'features/navigation/TabBar/TabBar'
import { Profile } from 'features/profile/pages/Profile/Profile'
import { withRemountOnColorSchemeHOC } from 'theme/withRemountOnColorSchemeHOC'

export const useIsSignedIn = () => {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn
}

const tabNavigatorDefinition = {
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
    freezeOnBlur: true,
  },
  tabBar: (
    props: React.JSX.IntrinsicAttributes & {
      navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
      state: TabNavigationState<ParamListBase>
    }
  ) => <TabBar {...props} />,
  screens: {
    Home: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Home)),
      linking: {
        path: 'accueil',
        parse: screenParamsParser.Home,
        alias: ['home'],
      },
    },
    SearchStackNavigator: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(SearchStackScreen)),
    },
    Bookings: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Bookings)),
      if: useIsSignedIn,
      options: { title: 'Mes réservations' },
      linking: {
        path: 'reservations',
        alias: ['bookings'],
      },
    },
    Favorites: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Favorites)),
      options: { title: 'Mes favoris' },
      linking: {
        path: 'favoris',
      },
    },
    Profile: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Profile)),
      options: { title: 'Mon profil' },
      linking: {
        path: 'profil',
      },
    },
  },
}

export const BottomTabNavigator = createBottomTabNavigator(tabNavigatorDefinition)

export const BottomTabScreen = createComponentForStaticNavigation(BottomTabNavigator, 'BottomTab')
