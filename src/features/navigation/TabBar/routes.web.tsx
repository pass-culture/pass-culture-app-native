import { Link, LinkingOptions } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { TabRoute } from 'features/navigation/TabBar/types'

// import { withAsyncErrorBoundary } from 'features/errors'
// import { Home as HomeComponent } from 'features/home/pages/Home'

// const Home = withAsyncErrorBoundary(HomeComponent)

export const initialRouteName = 'Search'

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

const Search = () => (
  <Page>
    <Text>Search page</Text>
    <Link to={'/abtesting'}>
      <Text>Go to ABTestingPOC</Text>
    </Link>
    <Link to={'/favorites'}>
      <Text>Go to Favorites</Text>
    </Link>
  </Page>
)

const Favorites = () => (
  <Page>
    <Text>Favorites</Text>
    <Link to={'/abtesting'}>
      <Text>Go to ABTestingPOC</Text>
    </Link>
    <Link to={'/search'}>
      <Text>Go to Search</Text>
    </Link>
  </Page>
)

const tabBarRoutes: Array<TabRoute> = [
  {
    name: 'Search',
    component: Search,
    path: '/search',
  },
  {
    name: 'Favorites',
    component: Favorites,
    path: '/favorites',
  },
].map((r) => ({ ...r, key: r.name } as TabRoute))

export const routes: Array<TabRoute> = [
  ...tabBarRoutes,
  // {
  //   name: 'Home',
  //   component: Home,
  //   key: 'Home-key',
  //   path: '/home',
  // },
  // {
  //   name: 'Search',
  //   component: Search,
  //   key: 'Search-key',
  //   path: '/search',
  // },
  // {
  //   name: 'Bookings',
  //   component: Bookings,
  //   key: 'Bookings-key',
  //   path: '/bookings',
  // },
  // {
  //   name: 'Favorites',
  //   component: Favorites,
  //   key: 'Favorites-key',
  //   path: '/favorites',
  // },
  // {
  //   name: 'Profile',
  //   component: Profile,
  //   key: 'Profile-key',
  //   path: '/profile',
  // },
]

export const linking: Partial<LinkingOptions> = {
  config: {
    initialRouteName,
    screens: routes.reduce(
      (route, currentRoute) => ({ ...route, [currentRoute.name]: currentRoute.path }),
      {}
    ),
  },
}
