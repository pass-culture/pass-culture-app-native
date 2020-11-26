import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { TabBar } from '../TabBar'

const state: TabNavigationState<Record<string, Record<string, unknown> | undefined>> = {
  history: [
    { key: 'Favorites-key', type: 'route' },
    { key: 'route2-key', type: 'route' },
    { key: 'Bookings-key', type: 'route' },
    { key: 'Profile-key', type: 'route' },
    { key: 'HomeNavigator-key', type: 'route' },
  ],
  index: 0,
  key: 'tab',
  routeNames: ['HomeNavigator', 'Search', 'Bookings', 'Favorites', 'Profile'],
  routes: [
    {
      key: 'HomeNavigator-key',
      name: 'HomeNavigator',
      params: undefined,
    },
    { key: 'Search-key', name: 'Search', params: undefined },
    { key: 'Bookings-key', name: 'Bookings', params: undefined },
    { key: 'Favorites-key', name: 'Favorites', params: undefined },
    { key: 'Profile-key', name: 'Profile', params: undefined },
  ],
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

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))
describe('TabBar', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    const tabBar = render(<TabBar state={state} navigation={navigation} />)
    expect(tabBar).toMatchSnapshot()
  })
  it('displays only one selected at a time', async () => {
    const tabBar = render(<TabBar state={state} navigation={navigation} />)
    expect(tabBar.queryAllByTestId(/selector/)).toHaveLength(1)
  })
  it('switches tab when clicked on another tab', () => {
    const tabBar = render(<TabBar state={state} navigation={navigation} />)
    expect(tabBar.queryByTestId('selector-tab-HomeNavigator')).toBeTruthy()
    expect(tabBar.queryByTestId('selector-tab-Search')).toBeFalsy()

    const searchTab = tabBar.getByTestId('tab-Search')
    fireEvent.press(searchTab)

    expect(navigation.emit).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('Search')
    tabBar.rerender(<TabBar state={{ ...state, index: 1 }} navigation={navigation} />)

    expect(tabBar.queryByTestId('selector-tab-HomeNavigator')).toBeFalsy()
    expect(tabBar.queryByTestId('selector-tab-Search')).toBeTruthy()
  })
  it('does not reset navigation when clicked on selected tab', () => {
    const tabBar = render(<TabBar state={state} navigation={navigation} />)
    expect(tabBar.queryByTestId('selector-tab-HomeNavigator')).toBeTruthy()

    const homeTab = tabBar.getByTestId('tab-HomeNavigator')
    fireEvent.press(homeTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})
