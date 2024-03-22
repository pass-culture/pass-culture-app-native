import { LinkingOptions } from '@react-navigation/native'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { searchNavigatorPathConfig } from 'features/navigation/SearchStackNavigator/routes'
import { SearchStackNavigator } from 'features/navigation/SearchStackNavigator/SearchStackNavigator'
import { Profile } from 'features/profile/pages/Profile'

import { TabStack } from './Stack'
import { TabParamList, TabRoute, TabRouteName } from './types'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

const routes: TabRoute[] = [
  {
    name: 'Home',
    component: Home,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
    options: { title: 'Page d’accueil' },
  },
  {
    name: 'SearchStackNavigator',
    component: SearchStackNavigator,
    pathConfig: searchNavigatorPathConfig,
  },
  {
    name: 'Bookings',
    component: Bookings,
    path: 'reservations',
    deeplinkPaths: ['bookings'],
    options: { title: 'Mes réservations' },
    secure: true,
  },
  {
    name: 'Favorites',
    component: Favorites,
    path: 'favoris',
    options: { title: 'Mes favoris' },
  },
  {
    name: 'Profile',
    component: Profile,
    path: 'profil',
    options: { title: 'Mon profil' },
  },
]

const tabRouteNames = routes.map((route) => route.name)

// Typeguard for screen params
export function isTabScreen(screen: ScreenNames): screen is TabRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in tabRouteNames
  return tabRouteNames.includes(screen)
}

const { screensConfig: tabScreensConfig, Screens: TabScreens } = getScreensAndConfig(
  routes,
  TabStack.Screen
)

export { TabScreens }
export const tabNavigatorPathConfig: LinkingOptions<TabParamList>['config'] = {
  initialRouteName,
  screens: tabScreensConfig,
}
