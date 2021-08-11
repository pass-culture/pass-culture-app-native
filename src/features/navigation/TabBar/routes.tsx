import { LinkingOptions } from '@react-navigation/native'

import { Bookings } from 'features/bookings/pages/Bookings'
import { withAsyncErrorBoundary } from 'features/errors'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { screenParamsParser } from 'features/navigation/screenParamsParser'
import { TabRoute } from 'features/navigation/TabBar/types'
import { Profile } from 'features/profile/pages/Profile'
import { Search } from 'features/search/pages/Search'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

export const routes: Array<TabRoute> = [
  {
    name: 'Home',
    component: Home,
    pathConfig: {
      path: 'home',
      parse: screenParamsParser['Home'],
    },
  },
  {
    name: 'Search',
    component: Search,
    path: 'search',
  },
  {
    name: 'Bookings',
    component: Bookings,
    path: 'bookings',
  },
  {
    name: 'Favorites',
    component: Favorites,
    path: 'favorites',
  },
  {
    name: 'Profile',
    component: Profile,
    path: 'profile',
  },
].map((r) => ({ ...r, key: r.name } as TabRoute))

export const tabNavigatorPathConfig: LinkingOptions['config'] = {
  initialRouteName,
  screens: {
    ...routes.reduce(
      (route, currentRoute) => ({
        ...route,
        [currentRoute.name]: currentRoute.pathConfig || currentRoute.path,
      }),
      {}
    ),
  },
}
