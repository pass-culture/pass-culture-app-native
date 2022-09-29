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

const routes: TabRoute[] = [
  {
    name: 'Home',
    component: Home,
    pathConfig: { path: 'accueil', deeplinkPaths: ['home'], parse: screenParamsParser['Home'] },
    options: { title: 'Page d’accueil' },
  },
  {
    name: 'Search',
    component: Search,
    pathConfig: {
      path: 'recherche',
      parse: screenParamsParser['Search'],
      stringify: screenParamsStringifier['Search'],
    },
    options: { title: 'Recherche des offres' },
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

export const menu: Record<TabRouteName, { displayName: string; accessibilityLabel?: string }> = {
  Home: { displayName: 'Accueil', accessibilityLabel: 'Accueil' },
  Search: { displayName: 'Recherche', accessibilityLabel: 'Rechercher des offres' },
  Bookings: { displayName: 'Réservations', accessibilityLabel: 'Mes réservations' },
  Favorites: { displayName: 'Favoris', accessibilityLabel: undefined },
  Profile: { displayName: 'Profil', accessibilityLabel: 'Mon profil' },
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
