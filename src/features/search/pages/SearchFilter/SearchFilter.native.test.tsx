import React from 'react'

import { useNavigationState, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { GeoCoordinates } from 'libs/location/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { SearchFilter } from './SearchFilter'

useNavigationState.mockImplementation(() => [{ name: 'SearchFilter' }])

const mockStateDispatch = jest.fn()
const initialMockUseSearch = { searchState: initialSearchState, dispatch: mockStateDispatch }
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
const mockSetSelectedLocationMode = jest.fn()
const initialMockUseLocation = {
  geolocPosition: DEFAULT_POSITION,
  place: null,
  userLocation: DEFAULT_POSITION,
  selectedLocationMode: LocationMode.AROUND_ME,
  aroundMeRadius: DEFAULT_RADIUS,
  setSelectedLocationMode: mockSetSelectedLocationMode,
  hasGeolocPosition: false,
  setSelectedPlace: jest.fn(),
  setAroundMeRadius: jest.fn(),
  aroundPlaceRadius: DEFAULT_RADIUS,
  setPlace: jest.fn(),
}
const mockUseLocation: jest.Mock<Partial<ILocationContext>> = jest.fn(() => initialMockUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockData = PLACEHOLDER_DATA
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockNavigateToSearch = jest.fn()
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({
    navigateToSearch: mockNavigateToSearch,
    replaceToSearch: jest.fn(),
  }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SearchFilter/>', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    mockUseSearch.mockReturnValueOnce({
      ...initialMockUseSearch,
      searchState: {
        ...initialSearchState,
        locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
      },
    })
    renderSearchFilter()

    await screen.findByText('Filtres')

    await waitFor(() => {
      expect(screen).toMatchSnapshot()
    })
  })

  it('should reset search when pressing reset button and use back button', async () => {
    mockUseSearch.mockReturnValueOnce({
      ...initialMockUseSearch,
      searchState: {
        ...initialSearchState,
        locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
        minPrice: '5',
        defaultMinPrice: '5',
      },
    })
    renderSearchFilter()

    await screen.findByText('Filtres')
    await user.press(screen.getByText('Réinitialiser'))

    await user.press(screen.getByTestId('Revenir en arrière'))

    expect(mockNavigateToSearch).toHaveBeenCalledWith(
      initialSearchState,
      defaultDisabilitiesProperties
    )
  })

  it('should setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has a geolocposition', async () => {
    // we mock globally due to many renders
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseLocation.mockReturnValue({
      ...initialMockUseLocation,
      selectedLocationMode: LocationMode.EVERYWHERE,
      hasGeolocPosition: true,
    })

    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    renderSearchFilter()

    await screen.findByText('Filtres')

    await waitFor(() => {
      expect(mockSetSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_ME)
    })

    // we reset the mock to its initial state
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseLocation.mockReturnValue(initialMockUseLocation)
  })

  it("shouldn't setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has no geolocposition", async () => {
    mockUseLocation.mockReturnValueOnce({
      ...initialMockUseLocation,
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.EVERYWHERE,
    })
    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    renderSearchFilter()

    await screen.findByText('Filtres')

    expect(mockSetSelectedLocationMode).not.toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  describe('should update the SearchState, but keep the query, when pressing the reset button, and position', () => {
    it('is not null', async () => {
      renderSearchFilter()

      await screen.findByText('Filtres')
      await user.press(screen.getByText('Réinitialiser'))

      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
        },
      })
    })

    describe('is null', () => {
      beforeEach(() => {
        mockUseSearch.mockReturnValue({
          ...initialMockUseSearch,
          searchState: { ...initialSearchState, minPrice: '10' },
        })
        mockUseLocation.mockReturnValue({
          ...initialMockUseLocation,
          geolocPosition: undefined,
          userLocation: undefined,
          selectedLocationMode: LocationMode.EVERYWHERE,
        })
      })

      afterEach(() => {
        mockUseLocation.mockReturnValue(initialMockUseLocation)
        mockUseSearch.mockReturnValue(initialMockUseSearch)
      })

      it('should dispatch correctly', async () => {
        renderSearchFilter()

        await screen.findByText('Filtres')
        await user.press(screen.getByText('Réinitialiser'))

        expect(mockStateDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            locationFilter: { locationType: LocationMode.EVERYWHERE },
          },
        })
      })
    })
  })

  it('should log analytics when clicking on the reset button', async () => {
    renderSearchFilter()

    await screen.findByText('Filtres')
    await user.press(screen.getByText('Réinitialiser'))

    expect(analytics.logReinitializeFilters).toHaveBeenCalledTimes(1)
  })

  it('should display back button on header', async () => {
    renderSearchFilter()

    expect(await screen.findByTestId('Revenir en arrière')).toBeOnTheScreen()
  })

  it('should display accessibility section', async () => {
    renderSearchFilter()

    expect(await screen.findByText('Accessibilité')).toBeOnTheScreen()
  })

  it('should display calendar section', async () => {
    renderSearchFilter()

    expect(await screen.findByText('Dates')).toBeOnTheScreen()
  })
})

const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
