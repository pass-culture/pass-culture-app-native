import React from 'react'

import { useNavigationState, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { analytics } from 'libs/analytics'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SearchFilter } from './SearchFilter'

let mockSearchState = initialSearchState
useNavigationState.mockImplementation(() => [{ name: 'SearchFilter' }])

const mockStateDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION
let mockLocationMode = LocationMode.AROUND_ME
const mockAroundMeRadius = DEFAULT_RADIUS
let mockHasGeolocPosition = false
const mockSetSelectedLocationMode = jest.fn()

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    place: null,
    userLocation: mockPosition,
    selectedLocationMode: mockLocationMode,
    aroundMeRadius: mockAroundMeRadius,
    setSelectedLocationMode: mockSetSelectedLocationMode,
    hasGeolocPosition: mockHasGeolocPosition,
  }),
}))

const mockData = placeholderData
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

describe('<SearchFilter/>', () => {
  afterEach(() => {
    mockPosition = DEFAULT_POSITION
    mockSearchState = initialSearchState
    mockLocationMode = LocationMode.AROUND_ME
  })

  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
  })

  it('should render correctly', async () => {
    mockSearchState = {
      ...mockSearchState,
      locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
    }
    renderSearchFilter()
    await act(() => {})

    await screen.findByText('Filtres')

    expect(screen).toMatchSnapshot()
  })

  it('should setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has a geolocposition', async () => {
    mockHasGeolocPosition = true
    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    renderSearchFilter()

    await act(async () => {})

    expect(mockSetSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  it("shouldn't setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has no geolocposition", async () => {
    mockHasGeolocPosition = false
    mockLocationMode = LocationMode.EVERYWHERE
    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    renderSearchFilter()

    await act(async () => {})

    expect(mockSetSelectedLocationMode).not.toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  describe('should update the SearchState, but keep the query, when pressing the reset button, and position', () => {
    it('is not null', async () => {
      renderSearchFilter()

      await act(async () => {
        fireEvent.press(screen.getByText('Réinitialiser'))
      })

      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
          minPrice: undefined,
          maxPrice: undefined,
          offerGenreTypes: undefined,
          offerNativeCategories: undefined,
        },
      })
    })

    it('is null', async () => {
      mockPosition = undefined
      mockLocationMode = LocationMode.EVERYWHERE
      renderSearchFilter()

      await act(async () => {
        fireEvent.press(screen.getByText('Réinitialiser'))
      })

      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          locationFilter: { locationType: LocationMode.EVERYWHERE },
          minPrice: undefined,
          maxPrice: undefined,
          offerGenreTypes: undefined,
          offerNativeCategories: undefined,
        },
      })
    })
  })

  it('should log analytics when clicking on the reset button', async () => {
    renderSearchFilter()

    await act(async () => {
      fireEvent.press(screen.getByText('Réinitialiser'))
    })

    expect(analytics.logReinitializeFilters).toHaveBeenCalledTimes(1)
  })

  it('should display back button on header', async () => {
    renderSearchFilter()
    await act(async () => {})

    expect(screen.queryByTestId('Revenir en arrière')).toBeOnTheScreen()
  })
})

const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
