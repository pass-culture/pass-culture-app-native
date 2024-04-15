import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'

import { TabRoute, TabRouteName } from '../types'

const MockComponent = () => null
export const routes: Array<TabRoute> = [
  {
    name: 'Home',
    component: MockComponent,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
  },
  { name: 'SearchStackNavigator', component: MockComponent, path: 'test' },
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
