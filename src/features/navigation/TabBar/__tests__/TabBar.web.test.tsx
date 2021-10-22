import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

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
    jest.clearAllMocks()
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
  })
  afterAll(jest.clearAllMocks)

  it('renders correctly', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display the 5 following tabs', () => {
    const renderAPI = renderTabBar()
    const tabs = renderAPI.getAllByTestId(/tab/)
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
    const renderAPI = renderTabBar()
    expect(renderAPI.queryAllByTestId(/selected/)).toHaveLength(1)
  })

  it('does not reset navigation when clicked on selected tab', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI.queryByTestId('Home tab selected')).toBeTruthy()

    const homeTab = renderAPI.getByTestId('Home tab')
    fireEvent.click(homeTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('navigates to Profile on Profile tab click', () => {
    const renderAPI = renderTabBar()
    const profileTab = renderAPI.getByTestId('Profile tab')
    fireEvent.click(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('Profile')
  })
})

function renderTabBar() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<TabBar navigation={navigation} />)
  )
}
