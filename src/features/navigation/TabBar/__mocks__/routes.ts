import { LinkingOptions } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { searchNavigatorPathConfig } from 'features/navigation/SearchStackNavigator/__mocks__/routes'

import { TabParamList, TabRoute, TabRouteName } from '../types'

export const tabNavigatorPathConfig: LinkingOptions<TabParamList>['config'] = {
  initialRouteName: 'Home',
  screens: {
    Home: {
      path: 'accueil',
      parse: {},
    },
    SearchStackNavigator: {
      initialRouteName: 'SearchLanding',
      screens: {
        SearchLanding: {
          path: 'recherche/accueil',
          parse: {},
          stringify: {},
        },
        SearchResults: {
          path: 'recherche/resultats',
          parse: {},
          stringify: {},
        },
      },
    },
    Bookings: {
      path: 'reservations',
    },
    Favorites: {
      path: 'favoris',
    },
    Profile: {
      path: 'profil',
    },
  },
}
const MockComponent = () => null
export const routes: Array<TabRoute> = [
  {
    name: 'Home',
    component: MockComponent,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
  },
  {
    name: 'SearchStackNavigator',
    component: MockComponent,
    pathConfig: searchNavigatorPathConfig,
  },
  {
    name: 'Bookings',
    component: MockComponent,
    path: 'reservations',
  },
  {
    name: 'Favorites',
    component: MockComponent,
    path: 'favoris',
  },
  {
    name: 'Profile',
    component: MockComponent,
    path: 'profil',
  },
]

export const initialRouteName = 'Home'

const tabRouteNames = routes.map((route) => route.name)

// Typeguard for screen params
export function isTabScreen(screen: ScreenNames): screen is TabRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in tabRouteNames
  return tabRouteNames.includes(screen)
}
