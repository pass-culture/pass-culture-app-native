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
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { ComponentType, FunctionComponent } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home } from 'features/home/pages/Home'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { TabBar } from 'features/navigation/TabBar/TabBar'
import { Profile } from 'features/profile/pages/Profile'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'
import { useColorScheme } from 'libs/styled/useColorScheme'

const withRemountOnColorSchemeHOC = <Props extends object>(
  WrappedComponent: ComponentType<Props>
): ComponentType<Props> => {
  const ComponentKeyedByColorScheme: FunctionComponent<Props> = (props) => {
    const colorScheme = useColorScheme()
    return <WrappedComponent key={colorScheme} {...props} />
  }

  ComponentKeyedByColorScheme.displayName = `withRemountOnColorSchemeHOC(${WrappedComponent.name})`

  return ComponentKeyedByColorScheme
}

const useIsSignedIn = () => {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn
}

export const searchStackNavigatorConfig = {
  initialRouteName: 'SearchLanding',
  screenOptions: {
    headerShown: false,
    freezeOnBlur: true,
  },
  screens: {
    SearchLanding: {
      screen: SearchLanding,
      linking: {
        path: 'recherche/accueil',
        parse: screenParamsParser[SearchView.Landing],
        stringify: screenParamsStringifier[SearchView.Landing],
      },
    },
    SearchResults: {
      screen: SearchResults,
      linking: {
        path: 'recherche/resultats',
        parse: screenParamsParser[SearchView.Results],
        stringify: screenParamsStringifier[SearchView.Results],
      },
    },
    ThematicSearch: {
      screen: ThematicSearch,
      linking: {
        path: 'recherche/thematique',
        parse: screenParamsParser[SearchView.Thematic],
        stringify: screenParamsStringifier[SearchView.Thematic],
      },
    },
  },
}

const SearchStackNavigator = createNativeStackNavigator(searchStackNavigatorConfig)
const SearchStackScreen = createComponentForStaticNavigation(SearchStackNavigator, 'Search')

export const tabNavigatorConfig = {
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
    freezeOnBlur: true,
  },
  tabBar: (
    props: React.JSX.IntrinsicAttributes & {
      state: TabNavigationState<ParamListBase>
      navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
    }
  ) => <TabBar {...props} />,
  // screenLayout: ({ children }) => withRemountOnColorSchemeHOC(withAsyncErrorBoundary(children)),
  screens: {
    Home: {
      screen: Home,
      linking: {
        path: 'accueil',
        parse: screenParamsParser.Home,
        alias: ['home'],
      },
    },
    SearchStackNavigator: {
      screen: SearchStackScreen,
    },
    Bookings: {
      screen: Bookings,
      if: useIsSignedIn,
      options: { title: 'Mes réservations' },
      linking: {
        path: 'reservations',
        alias: ['bookings'],
      },
    },
    Favorites: {
      screen: Favorites,
      options: { title: 'Mes favoris' },
      linking: {
        path: 'favoris',
      },
    },
    Profile: {
      screen: Profile,
      options: { title: 'Mon profil' },
      linking: {
        path: 'profil',
      },
    },
  },
}

export const BottomTabNavigator = createBottomTabNavigator(tabNavigatorConfig)
export const BottomTabScreen = createComponentForStaticNavigation(BottomTabNavigator, 'BottomTab')
