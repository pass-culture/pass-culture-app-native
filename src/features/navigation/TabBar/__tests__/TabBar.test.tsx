import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { TabBar } from '../TabBar'
import { tabBarRoutes } from '../TabNavigator'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

const state: TabNavigationState<Record<string, Record<string, unknown> | undefined>> = {
  history: [
    { key: 'Favorites-key', type: 'route' },
    { key: 'route2-key', type: 'route' },
    { key: 'Bookings-key', type: 'route' },
    { key: 'Profile-key', type: 'route' },
    { key: 'Home-key', type: 'route' },
  ],
  index: 0,
  key: 'tab',
  routeNames: tabBarRoutes.map((route) => route.name),
  routes: tabBarRoutes,
  stale: false,
  type: 'tab',
}

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  // @ts-ignore : ignore type of emit to facilitate testing
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
    expect(tabBar.queryAllByTestId(/^tab-/)).toHaveLength(5)
    expect(tabBar.queryByTestId('tab-Home')).toBeTruthy()
    expect(tabBar.queryByTestId('tab-Search')).toBeTruthy()
    expect(tabBar.queryByTestId('tab-Bookings')).toBeTruthy()
    expect(tabBar.queryByTestId('tab-Favorites')).toBeTruthy()
    expect(tabBar.queryByTestId('tab-Profile')).toBeTruthy()
  })

  it('should NOT display InitialRoutingScreen tab', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryByTestId('tab-InitialRoutingScreen')).toBeFalsy()
  })

  it('displays only one selected at a time', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryAllByTestId(/selector/)).toHaveLength(1)
  })

  it('switches tab when clicked on another tab', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryByTestId('selector-tab-Home')).toBeTruthy()
    expect(tabBar.queryByTestId('selector-tab-Search')).toBeFalsy()

    const searchTab = tabBar.getByTestId('tab-Search')
    fireEvent.press(searchTab)

    expect(navigation.emit).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('Search')
    tabBar.rerender(
      reactQueryProviderHOC(<TabBar state={{ ...state, index: 1 }} navigation={navigation} />)
    )

    expect(tabBar.queryByTestId('selector-tab-Home')).toBeFalsy()
    expect(tabBar.queryByTestId('selector-tab-Search')).toBeTruthy()
  })

  it('does not reset navigation when clicked on selected tab', () => {
    const tabBar = renderTabBar()
    expect(tabBar.queryByTestId('selector-tab-Home')).toBeTruthy()

    const homeTab = tabBar.getByTestId('tab-Home')
    fireEvent.press(homeTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('navigates to Profile on Profile tab click', () => {
    const tabBar = renderTabBar()
    const profileTab = tabBar.getByTestId('tab-Profile')
    fireEvent.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('Profile')
  })
})

function renderTabBar() {
  return render(reactQueryProviderHOC(<TabBar state={state} navigation={navigation} />))
}
