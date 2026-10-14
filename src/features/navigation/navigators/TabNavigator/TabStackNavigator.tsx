import {
  BottomTabNavigationEventMap,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { useShouldDisplayGeneralPublicHome } from 'features/generalPublicHome/hooks/useShouldDisplayGeneralPublicHome'
import { GeneralPublicMap } from 'features/generalPublicHome/pages/GeneralPublicMap'
import { HomeSwitch } from 'features/generalPublicHome/pages/HomeSwitch'
import { screenParamsParser } from 'features/navigation/helpers/screenParamsUtils'
import {
  SEARCH_STACK_LINKING_SCREENS,
  SearchStackScreen,
} from 'features/navigation/navigators/SearchStackNavigator/SearchStackNavigator'
import { TabBar } from 'features/navigation/TabBar/TabBar'
import { Profile } from 'features/profile/pages/Profile/Profile'
import { withRemountOnColorSchemeHOC } from 'theme/withRemountOnColorSchemeHOC'

export const useIsSignedIn = () => {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn
}

const tabNavigatorDefinition = {
  initialRouteName: 'Home',
  screenOptions: { headerShown: false, freezeOnBlur: true },
  tabBar: (
    props: React.JSX.IntrinsicAttributes & {
      navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
      state: TabNavigationState<ParamListBase>
    }
  ) => <TabBar {...props} />,
  screens: {
    Home: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(HomeSwitch)),
      options: { title: 'Accueil' },
      linking: { path: 'accueil', parse: screenParamsParser.Home, alias: ['home'] },
    },
    AroundMe: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(GeneralPublicMap)),
      if: useShouldDisplayGeneralPublicHome,
      options: { title: 'Carte' },
      linking: { path: 'carte' },
    },
    SearchStackNavigator: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(SearchStackScreen)),
      options: { title: 'Recherche' },
      linking: { screens: SEARCH_STACK_LINKING_SCREENS },
    },
    Bookings: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Bookings)),
      if: useIsSignedIn,
      options: { title: 'Réservations' },
      linking: { path: 'reservations', alias: ['bookings'] },
    },
    Favorites: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Favorites)),
      options: { title: 'Favoris' },
      linking: { path: 'favoris' },
    },
    Profile: {
      screen: withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Profile)),
      options: { title: 'Profil' },
      linking: { path: 'profil' },
    },
  },
}

export const BottomTabNavigator = createBottomTabNavigator(tabNavigatorDefinition)

export const BottomTabScreen = BottomTabNavigator.getComponent()
