import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import * as navigationRefAPI from 'features/navigation/navigationRef'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { ThemeProvider } from 'libs/styled'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { AccessibleTabBar } from './AccessibleTabBar'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  const mockNavigate = jest.fn()
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
    useNavigationState: jest.fn(() => ({ name: 'TabNavigator', key: 'tab-1' })),
    NavigationContainer: actualNav.NavigationContainer,
  }
})

const mockSearchState = {
  ...initialSearchState,
  accessibilityFilter: defaultDisabilitiesProperties,
}
const mockDispatch = jest.fn()
const mockShowSuggestions = jest.fn()
const mockHideSuggestions = jest.fn()
const mockIsFocusOnSuggestions = false

const defaultUseSearch = {
  searchState: mockSearchState,
  dispatch: mockDispatch,
  showSuggestions: mockShowSuggestions,
  hideSuggestions: mockHideSuggestions,
  isFocusOnSuggestions: mockIsFocusOnSuggestions,
}
const mockedUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => defaultUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockedUseSearch(),
}))

jest.mock('features/navigation/TabBar/TabNavigationStateContext', () => {
  const { DEFAULT_TAB_ROUTES } = jest.requireActual(
    'features/navigation/TabBar/TabNavigationStateContext'
  )
  return { DEFAULT_TAB_ROUTES, useTabNavigationContext: jest.fn() }
})
const mockedUseTabNavigationContext = jest.mocked(useTabNavigationContext)

jest.mock('features/navigation/helpers/useTabBarItemBadges')
const mockUseTabBarItemBadges = useTabBarItemBadges as jest.Mock

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockedLocation = {
  locationType: LocationMode.AROUND_ME,
  aroundRadius: 10,
  place: mockedPlace,
}

describe('AccessibleTabBar', () => {
  beforeAll(() => {
    mockUseTabBarItemBadges.mockReturnValue({
      Bookings: 999,
    })
  })

  beforeEach(() => {
    setFeatureFlags()
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
    mockedUseSearch.mockReturnValue(defaultUseSearch)
  })

  it('renders correclty', async () => {
    renderTabBar()

    expect(await screen.findByText('99+')).toBeInTheDocument()
  })

  it('should display the 5 following tabs', () => {
    renderTabBar()
    const expectedTabsTestIds = ['Accueil', 'Recherche', 'Réservations', 'Favoris', 'Profil']

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument()
    })
  })

  it('displays only one selected at a time', () => {
    renderTabBar()

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should identify only one tab as current page', () => {
    renderTabBar()
    const tabsTestIds = [
      'Accueil - actif',
      'Rechercher des offres - inactif',
      'Mes réservations - inactif',
      'Mes favoris - inactif',
      'Mon profil - inactif',
    ]
    const tabs = tabsTestIds.map((testID) => screen.getByLabelText(testID))

    const currentPageList = tabs
      .map((tab) => tab.getAttribute('aria-current'))
      .filter((attr) => !!attr)

    expect(currentPageList).toHaveLength(1)
  })

  it('should call navigate with searchState params reinitialized except for location on press "Recherche"', async () => {
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')

    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'SearchStackNavigator',
      })),
    })
    mockedUseSearch.mockReturnValueOnce({
      ...defaultUseSearch,
      searchState: { ...mockSearchState, query: 'query', locationFilter: mockedLocation },
    })

    renderTabBar()

    const searchButton = await screen.findByText('Recherche')
    fireEvent.click(searchButton)

    await waitFor(() =>
      expect(navigateFromRefSpy).toHaveBeenCalledWith(
        ...getSearchHookConfig('SearchLanding', {
          ...mockSearchState,
          query: '',
          locationFilter: mockedLocation,
        })
      )
    )
  })
})

function renderTabBar() {
  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <ThemeProvider theme={computedTheme} colorScheme={ColorScheme.LIGHT}>
          <AccessibleTabBar id="tabBarID" />
        </ThemeProvider>
      </NavigationContainer>
    )
  )
}
