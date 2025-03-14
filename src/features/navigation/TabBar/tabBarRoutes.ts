import { LinkingOptions } from '@react-navigation/native'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { profileNavigatorPathConfig } from 'features/navigation/ProfileStackNavigator/profileNavigatorPathConfig'
import { SuspenseProfileStackNavigator } from 'features/navigation/ProfileStackNavigator/SuspenseProfileStackNavigator'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { searchNavigatorPathConfig } from 'features/navigation/SearchStackNavigator/searchRoutes'
import { SuspenseSearchStackNavigator } from 'features/navigation/SearchStackNavigator/SuspenseSearchStackNavigator'

import { TabStack } from './Stack'
import { TabParamList, TabRoute, TabRouteName } from './types'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

const tabBarRoutes: TabRoute[] = [
  {
    name: 'Home',
    component: Home,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
    options: { title: 'Page d’accueil' },
  },
  {
    name: 'SearchStackNavigator',
    component: SuspenseSearchStackNavigator,
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
    name: 'ProfileStackNavigator',
    component: SuspenseProfileStackNavigator,
    pathConfig: profileNavigatorPathConfig,
  },
]

export function isTabScreen(screen: string): screen is TabRouteName {
  const tabRouteNames = tabBarRoutes.map((route): string => route.name)
  return tabRouteNames.includes(screen)
}

const { screensConfig: tabScreensConfig, Screens: TabScreens } = getScreensAndConfig(
  tabBarRoutes,
  TabStack.Screen
)

export { TabScreens }
export const tabNavigatorPathConfig: LinkingOptions<TabParamList>['config'] = {
  initialRouteName,
  screens: tabScreensConfig,
}
