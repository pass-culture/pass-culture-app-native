import { LinkingOptions } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { TabRoute } from 'features/navigation/TabBar/types'

// import { withAsyncErrorBoundary } from 'features/errors'
// import { Home as HomeComponent } from 'features/home/pages/Home'

// const Home = withAsyncErrorBoundary(HomeComponent)

export const initialRouteName = 'Page2'

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

const Page2 = () => (
  <Page>
    <Text>Page 2</Text>
  </Page>
)

const Page3 = () => (
  <Page>
    <Text>Page 3</Text>
  </Page>
)

const tabBarRoutes: Array<TabRoute> = [
  {
    name: 'Home',
    key: 'Home-key',
    component: Page2,
    path: '/page2',
  },
  {
    name: 'Favorites',
    key: 'Favorites-key',
    component: Page3,
    path: '/page3',
  },
]

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
    screens: routes.reduce(
      (route, currentRoute) => ({ ...route, [currentRoute.name]: currentRoute.path }),
      {}
    ),
  },
}
