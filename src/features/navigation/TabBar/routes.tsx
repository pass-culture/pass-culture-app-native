import { LinkingOptions } from '@react-navigation/native'

import { Bookings } from 'features/bookings/pages/Bookings'
import { withAsyncErrorBoundary } from 'features/errors'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home as HomeComponent } from 'features/home/pages/Home'
import { TabRoute } from 'features/navigation/TabBar/types'
import { Profile } from 'features/profile/pages/Profile'
import { Search } from 'features/search/pages/Search'

export const initialRouteName = 'Home'

const Home = withAsyncErrorBoundary(HomeComponent)

export const routes: Array<TabRoute> = [
  {
    name: 'Home',
    component: Home,
    key: 'Home-key',
    path: '/home',
  },
  {
    name: 'Search',
    component: Search,
    key: 'Search-key',
    path: '/search',
  },
  {
    name: 'Bookings',
    component: Bookings,
    key: 'Bookings-key',
    path: '/bookings',
  },
  {
    name: 'Favorites',
    component: Favorites,
    key: 'Favorites-key',
    path: '/favorites',
  },
  {
    name: 'Profile',
    component: Profile,
    key: 'Profile-key',
    path: '/profile',
  },
]

export const linking: Partial<LinkingOptions> = {
  config: {
    screens: {
      ...routes.reduce(
        (route, currentRoute) => ({ ...route, [currentRoute.name]: currentRoute.path }),
        {}
      ),
    },
  },
}
