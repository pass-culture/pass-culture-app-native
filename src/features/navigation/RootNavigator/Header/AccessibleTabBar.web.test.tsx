import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

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
    renderTabBar()
    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeInTheDocument()
    })
  })

  it('displays only one selected at a time', () => {
    renderTabBar()

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should identify only one tab as current page', () => {
    renderTabBar()
    const tabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]
    const tabs = tabsTestIds.map((testID) => screen.getByTestId(testID))

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
