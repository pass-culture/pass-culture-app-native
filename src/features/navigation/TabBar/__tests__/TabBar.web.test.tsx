import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { TabBar } from '../TabBar'
import { TabRouteName } from '../types'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

const TAB_ROUTES: { name: TabRouteName; key: string }[] = [
  { name: 'Home', key: '' },
  { name: 'Search', key: '' },
  { name: 'Bookings', key: '' },
  { name: 'Favorites', key: '' },
  { name: 'Profile', key: '' },
]
const TAB_ROUTE_NAMES: TabRouteName[] = TAB_ROUTES.map((route) => route.name)

const state: TabNavigationState<Record<string, Record<string, unknown> | undefined>> = {
  history: [],
  index: 0,
  key: 'tab',
  routeNames: TAB_ROUTE_NAMES,
  routes: TAB_ROUTES,
  stale: false,
  type: 'tab',
}

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  // @ts-expect-error : ignore type of emit to facilitate testing
  emit: jest.fn(() => ({ defaultPrevented: false })),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  navigate: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
}

describe('TabBar', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const tabBar = renderTabBar()
    expect(tabBar).toMatchSnapshot()
  })

  it('should display the 5 following tabs', () => {
    const tabBar = renderTabBar()
    const tabs = tabBar.getAllByTestId(/tab/)
    const tabsTestIds = tabs.map((tab) => tab.getAttribute('data-testid')).sort()
    const expectedTabsTestIds = [
      'Home tab selected',
      'Home tab',
      'Search tab',
      'Bookings tab',
      'Favorites tab',
      'Profile tab',
    ].sort()
    expect(tabsTestIds).toEqual(expectedTabsTestIds)
  })

  it('displays only one selected at a time', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryAllByTestId(/selected/)).toHaveLength(1)
  })

  it('switches tab when clicked on another tab', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryByTestId('Home tab selected')).toBeTruthy()
    expect(tabBar.queryByTestId('Search tab selected')).toBeFalsy()

    const searchTab = tabBar.getByTestId('Search tab')
    fireEvent.click(searchTab)

    expect(navigation.emit).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('Search')
    tabBar.rerender(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<TabBar state={{ ...state, index: 1 }} navigation={navigation} />)
    )

    expect(tabBar.queryByTestId('Home tab selected')).toBeFalsy()
    expect(tabBar.queryByTestId('Search tab selected')).toBeTruthy()
  })

  it('does not reset navigation when clicked on selected tab', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryByTestId('Home tab selected')).toBeTruthy()

    const homeTab = tabBar.getByTestId('Home tab')
    fireEvent.click(homeTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('navigates to Profile on Profile tab click', () => {
    const tabBar = renderTabBar()
    const profileTab = tabBar.getByTestId('Profile tab')
    fireEvent.click(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('Profile')
  })
})

function renderTabBar() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<TabBar state={state} navigation={navigation} />))
}
