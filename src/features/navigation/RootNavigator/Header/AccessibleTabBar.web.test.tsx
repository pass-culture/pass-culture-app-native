import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import * as navigationRefAPI from 'features/navigation/navigationRef'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/searchStackHelpers'
import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { ThemeProvider } from 'libs/styled'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils/web'

import { AccessibleTabBar } from './AccessibleTabBar'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
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
const mockDispatch = jest.fn()
const mockShowSuggestions = jest.fn()
const mockIsFocusOnSuggestions = false

const defaultUseSearch = {
  searchState: mockSearchState,
  dispatch: mockDispatch,
  showSuggestions: mockShowSuggestions,
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

  it('renders correclty when FF is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    renderTabBar()

    expect(await screen.findByText('99+')).toBeInTheDocument()
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

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
      ...getSearchStackConfig('SearchLanding', {
        ...mockSearchState,
        query: '',
        locationFilter: mockedLocation,
      })
    )
  })
})

function renderTabBar() {
  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <ThemeProvider theme={computedTheme} colorScheme="light">
          <AccessibleTabBar id="tabBarID" />
        </ThemeProvider>
      </NavigationContainer>
    )
  )
}
