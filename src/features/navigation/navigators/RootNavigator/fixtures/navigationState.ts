import {
  AllNavParamList,
  NavigationResultState,
  RootScreenNames,
} from 'features/navigation/navigators/RootNavigator/types'
import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'

type TestRoute = {
  name: RootScreenNames | TabScreens
  params?: AllNavParamList[RootScreenNames | TabScreens]
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
      { name: 'ProfileStackNavigator' },
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
      { name: 'ProfileStackNavigator' },
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
      { name: 'ProfileStackNavigator' },
    ]),
  },
])
