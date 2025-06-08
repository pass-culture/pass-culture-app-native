import { LinkingOptions } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { searchNavigatorPathConfig } from 'features/navigation/SearchStackNavigator/__mocks__/searchRoutes'

import { TabParamList, TabRouteName } from '../types'

export const tabNavigatorPathConfig: LinkingOptions<TabParamList>['config'] = {
  initialRouteName: 'Home',
  screens: {
    Home: {
      path: 'accueil',
      parse: {},
    },
    SearchStackNavigator: searchNavigatorPathConfig,
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
export const tabBarRoutes = [
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

const tabRouteNames = tabBarRoutes.map((route) => route.name)

// Typeguard for screen params
export function isTabScreen(screen: ScreenNames): screen is TabRouteName {
  return tabRouteNames.includes(screen)
}
