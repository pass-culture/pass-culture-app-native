import { t } from '@lingui/macro'
import { LinkingOptions } from '@react-navigation/native'

import { Bookings } from 'features/bookings/pages/Bookings'
import { withAsyncErrorBoundary } from 'features/errors'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { ScreenNames } from 'features/navigation/RootNavigator'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { Profile } from 'features/profile/pages/Profile'
import { Search } from 'features/search/pages/Search'

import { TabStack } from './Stack'
import { TabParamList, TabRoute, TabRouteName } from './types'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

export const routes: TabRoute[] = [
  {
    name: 'Home',
    component: Home,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
  },
  {
    name: 'Search',
    component: Search,
    pathConfig: {
      path: 'recherche',
      parse: screenParamsParser['Search'],
      stringify: screenParamsStringifier['Search'],
    },
    options: { title: t`Recherche des offres` },
  },
  {
    name: 'Bookings',
    component: Bookings,
    path: 'reservations',
    deeplinkPaths: ['bookings'],
    options: { title: t`Réservations` },
    secure: true,
  },
  {
    name: 'Favorites',
    component: Favorites,
    path: 'favoris',
    options: { title: t`Favoris` },
  },
  {
    name: 'Profile',
    component: Profile,
    path: 'profil',
    options: { title: t`Profil` },
  },
]

const tabRouteNames = routes.map((route) => route.name)

// Typeguard for screen params
export function isTabScreen(screen: ScreenNames): screen is TabRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in tabRouteNames
  return tabRouteNames.includes(screen)
}

export const menu: Record<TabRouteName, string> = {
  Home: t`Accueil`,
  Search: t`Recherche`,
  Bookings: t`Réservations`,
  Favorites: t`Favoris`,
  Profile: t`Profil`,
}

export const { screensConfig: tabScreensConfig, Screens: TabScreens } = getScreensAndConfig(
  routes,
  TabStack.Screen
)

export const tabNavigatorPathConfig: LinkingOptions<TabParamList>['config'] = {
  initialRouteName,
  screens: tabScreensConfig,
}
