import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { TabBar } from '../TabBar'

jest.mock('features/navigation/TabBar/TabNavigationStateContext', () => {
  const { DEFAULT_TAB_ROUTES } = jest.requireActual(
    'features/navigation/TabBar/TabNavigationStateContext'
  )
  return { DEFAULT_TAB_ROUTES, useTabNavigationContext: jest.fn() }
})
const mockedUseTabNavigationContext = mocked(useTabNavigationContext)

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  // @ts-expect-error : ignore type of emit to facilitate testing
  emit: jest.fn(() => ({ defaultPrevented: false })),
  navigate: jest.fn(),
}

describe('TabBar', () => {
  beforeEach(() => {
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
  })

  it('renders correctly', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display the 5 following tabs with Home selected', () => {
    const renderAPI = renderTabBar()
    const tabs = renderAPI.getAllByTestId(/tab/)
    const tabsTestIds = tabs.map((tab) => tab.props.testID).sort()
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

  it('should display the 5 following tabs with Bookings selected', () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Bookings',
      })),
    })
    const renderAPI = renderTabBar()
    const tabs = renderAPI.getAllByTestId(/tab/)
    const tabsTestIds = tabs.map((tab) => tab.props.testID).sort()
    const expectedTabsTestIds = [
      'Home tab',
      'Search tab',
      'Bookings tab',
      'Bookings tab selected',
      'Favorites tab',
      'Profile tab',
    ].sort()
    expect(tabsTestIds).toEqual(expectedTabsTestIds)
  })

  it('displays only one selected at a time', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI.queryAllByTestId(/selected/)).toHaveLength(1)
  })

  it('does not reset navigation when clicked on selected tab', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI.queryByTestId('Home tab selected')).toBeTruthy()

    const homeTab = renderAPI.getByTestId('Home tab')
    fireEvent.press(homeTab)

    expect(navigation.emit).not.toBeCalled()
    expect(navigation.navigate).not.toBeCalled()
  })

  it('navigates to Profile on Profile tab click', () => {
    const renderAPI = renderTabBar()
    const profileTab = renderAPI.getByTestId('Profile tab')

    fireEvent.press(profileTab)

    expect(navigation.navigate).toBeCalledWith('Profile')
  })
})

function renderTabBar() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<TabBar navigation={navigation} />)
  )
}
