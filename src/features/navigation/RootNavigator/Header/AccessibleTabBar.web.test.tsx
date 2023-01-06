import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

import { AccessibleTabBar } from './AccessibleTabBar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

describe('AccessibleTabBar', () => {
  it('renders correctly', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display the 5 following tabs', () => {
    const { queryByTestId } = renderTabBar()
    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]

    expectedTabsTestIds.map((tab) => {
      expect(queryByTestId(tab)).toBeTruthy()
    })
  })

  it('displays only one selected at a time', () => {
    const renderAPI = renderTabBar()
    expect(renderAPI.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should identify only one tab as current page', () => {
    const renderAPI = renderTabBar()
    const tabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]
    const tabs = tabsTestIds.map((testID) => renderAPI.getByTestId(testID))

    const currentPageList = tabs
      .map((tab) => tab.getAttribute('aria-current'))
      .filter((attr) => !!attr)
    expect(currentPageList).toHaveLength(1)
  })
})

function renderTabBar() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AccessibleTabBar id="tabBarID" />)
  )
}
