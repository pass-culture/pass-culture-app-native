import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

import { AccessibleTabBar } from '../AccessibleTabBar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

describe('AccessibleTabBar', () => {
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
})

function renderTabBar() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AccessibleTabBar />)
  )
}
