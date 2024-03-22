import {
  AllNavParamList,
  NavigationResultState,
  RootScreenNames,
} from 'features/navigation/RootNavigator/types'
import { TabRouteName } from 'features/navigation/TabBar/types'

type TestRoute = {
  name: RootScreenNames | TabRouteName
  params?: AllNavParamList[RootScreenNames | TabRouteName]
  state?: NavigationResultState
}

function createState(
  type: 'stack' | 'tab',
  index: number | undefined,
  routes: TestRoute[]
): NavigationResultState {
  return {
    stale: undefined,
    type,
    key: `${type}-key`,
    index,
    routeNames: routes.map((route) => route.name),
    routes: routes.map((route) => ({ ...route, key: `${route.name}-key` })),
  }
}

// displayed screen is Search
export const state1 = createState('stack', 0, [
  {
    name: 'TabNavigator',
    state: createState('tab', 2, [
      { name: 'Home' },
      { name: 'Profile' },
      { name: 'SearchStackNavigator' },
    ]),
  },
])

// displayed screen is Login
export const state2 = createState('stack', 1, [
  {
    name: 'TabNavigator',
    state: createState('tab', 0, [
      { name: 'Home' },
      { name: 'SearchStackNavigator' },
      { name: 'Profile' },
    ]),
  },
  { name: 'Login' },
  { name: 'Offer' },
])

// displayed screen is Home
export const state3 = createState('stack', 0, [
  {
    name: 'TabNavigator',
    state: createState('tab', 1, [
      { name: 'SearchStackNavigator' },
      { name: 'Home' },
      { name: 'Profile' },
    ]),
  },
])
