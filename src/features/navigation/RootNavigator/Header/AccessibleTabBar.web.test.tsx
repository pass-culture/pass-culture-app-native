import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import * as navigationRefAPI from 'features/navigation/navigationRef'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils/web'

import { AccessibleTabBar } from './AccessibleTabBar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))
const mockSearchState = {
  ...initialSearchState,
  accessibilityFilter: defaultDisabilitiesProperties,
}
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: jest.fn() }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('AccessibleTabBar', () => {
  it('renders correctly', () => {
    const { container } = renderTabBar()

    expect(container).toMatchSnapshot()
  })

  it('renders correctly when FF is enabled', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    const { container } = renderTabBar()

    expect(container).toMatchSnapshot()
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

  it('should call navigate with searchState params on press "Recherche"', async () => {
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
      ...getSearchStackConfig('SearchLanding', mockSearchState)
    )
  })

  it('should reset params on press "Recherche" when already on Search tab', async () => {
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
      ...getSearchStackConfig('SearchLanding', mockSearchState)
    )
  })
})

function renderTabBar() {
  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <AccessibleTabBar id="tabBarID" />
      </NavigationContainer>
    )
  )
}
