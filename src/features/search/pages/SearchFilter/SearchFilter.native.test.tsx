import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SearchFilter } from './SearchFilter'

const mockSearchState = initialSearchState
const mockStateDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    hasGeolocPosition: true,
    place: null,
    userLocation: mockPosition,
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
  })

  it('should render correctly', async () => {
    mockSearchState.locationFilter = {
      locationType: LocationMode.AROUND_ME,
      aroundRadius: DEFAULT_RADIUS,
    }
    renderSearchFilter()

    await screen.findByText('Filtres')

    expect(screen).toMatchSnapshot()
  })

  it('should load url params when opening the general filters page', async () => {
    useRoute.mockReturnValueOnce({
      params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
    renderSearchFilter()
    await act(async () => {})

    expect(mockStateDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
  })

  describe('should navigate on search results with the current search state', () => {
    it('when pressing go back', async () => {
      useRoute.mockReturnValueOnce({ params: initialSearchState })
      renderSearchFilter()

      await act(async () => {
        fireEvent.press(screen.getByTestId('Revenir en arrière'))
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { ...initialSearchState, view: SearchView.Results },
        screen: 'Search',
      })
    })

    it('when pressing Rechercher', async () => {
      renderSearchFilter()

      await act(async () => {
        fireEvent.press(screen.getByText('Rechercher'))
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { ...mockSearchState, view: SearchView.Results },
        screen: 'Search',
      })
    })
  })

  describe('should update the SearchState, but keep the query, when pressing the reset button, and position', () => {
    it('is not null', async () => {
      mockPosition = DEFAULT_POSITION
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
