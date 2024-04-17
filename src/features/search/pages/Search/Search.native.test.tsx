import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import * as useShowResultsForCategory from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { Search } from 'features/search/pages/Search/Search'
import { SearchState, SearchView } from 'features/search/types'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { SuggestedPlace } from 'libs/place/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const venue = mockedSuggestedVenue

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  venue,
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
let mockIsFocusOnSuggestions = false
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
    hideSuggestions: jest.fn(),
  }),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
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

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))
jest.mock('features/search/helpers/useSearchHistory/useSearchHistory', () => ({
  useSearchHistory: () => ({
    filteredHistory: [],
    addToHistory: jest.fn(),
    removeFromHistory: jest.fn(),
    search: jest.fn(),
  }),
}))

const mockHits = [
  {
    objectID: '1',
    offer: { name: 'Test1', searchGroupName: 'MUSIQUE' },
    _highlightResult: {
      query: {
        value: '<mark>Test1</mark>',
        matchLevel: 'full',
        fullyHighlighted: true,
        matchedWords: ['Test1'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
  {
    objectID: '2',
    offer: { name: 'Test2', searchGroupName: 'MUSIQUE' },
    _geoloc: {},
    _highlightResult: {
      query: {
        value: '<mark>Test2</mark>',
        matchLevel: 'full',
        fullyHighlighted: true,
        matchedWords: ['Test2'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
]

jest.mock('react-instantsearch-core', () => ({
  ...jest.requireActual('react-instantsearch-core'),
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
jest.mock('algoliasearch')

const mockSubcategoriesData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

const mockUseSearchHistory = jest.fn()
jest.mock('features/search/helpers/useSearchHistory/useSearchHistory', () => ({
  useSearchHistory: jest.fn(() => mockUseSearchHistory()),
}))
mockUseSearchHistory.mockReturnValue({
  filteredHistory: mockedSearchHistory,
  queryHistory: '',
  addToHistory: jest.fn(),
  removeFromHistory: jest.fn(),
  search: jest.fn(),
})

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockSetPlace = jest.fn()
const mockSetSelectedLocationMode = jest.fn()
let mockHasGeolocPosition = true
const mockSelectedLocationMode = LocationMode.AROUND_ME

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    setPlace: mockSetPlace,
    place: mockedPlace,
    onModalHideRef: jest.fn(),
    isCurrentLocationMode: jest.fn(),
    setSelectedLocationMode: mockSetSelectedLocationMode,
    hasGeolocPosition: mockHasGeolocPosition,
    selectedLocationMode: mockSelectedLocationMode, // to have the venue map block display
  }),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<Search/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(() => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
      venue,
      priceRange: [0, 20],
    }
    mockIsFocusOnSuggestions = false
    mockHasGeolocPosition = false
  })

  it('should setPlace and setLocationMode in location context, when URI params contains a place,', async () => {
    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_PLACE,
          place: mockedPlace,
        },
      },
    })

    render(<Search />)

    await act(async () => {})

    expect(mockSetPlace).toHaveBeenCalledWith(mockedPlace)
    expect(mockSetSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_PLACE)
  })

  it('should setLocationMode to AROUND-ME in location context,when URI params contains AROUND-ME and hasGeolocPosition is true', async () => {
    mockHasGeolocPosition = true
    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    render(<Search />)

    await act(async () => {})

    expect(mockSetSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  it("shouldn't setLocationMode to AROUND-ME in location context,when URI params contains AROUND-ME and hasGeolocPosition is false", async () => {
    mockHasGeolocPosition = false

    useRoute.mockReturnValueOnce({
      params: {
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
        },
      },
    })

    render(<Search />)

    await act(async () => {})

    expect(mockSetSelectedLocationMode).not.toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  it('should render Search', async () => {
    mockHasGeolocPosition = true
    render(<Search />)

    await screen.findByText('Rechercher')

    await act(() => {})

    expect(screen).toMatchSnapshot()
  })

  it('should handle coming from "See More" correctly', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    render(<Search />)
    await act(async () => {})

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it.each([SearchView.Landing, SearchView.Results])(
    'should not display suggestions when search view is not suggestions',
    async (view) => {
      mockSearchState = { ...mockSearchState, view }

      render(<Search />)
      await act(async () => {})

      expect(screen.queryByTestId('autocompleteOfferItem_1')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('autocompleteOfferItem_2')).not.toBeOnTheScreen()
    }
  )

  describe('When search not executed', () => {
    beforeEach(() => {
      mockSearchState = { ...mockSearchState, view: SearchView.Landing }
    })

    it('should display categories buttons', async () => {
      render(<Search />, { wrapper: SearchWrapper })
      await act(async () => {})

      const categoriesButtons = screen.getByTestId('categoriesButtons')

      expect(categoriesButtons).toBeOnTheScreen()
    })

    it('should show results for a category when pressing a category button', async () => {
      const mockShowResultsForCategory = jest.fn()
      jest
        .spyOn(useShowResultsForCategory, 'useShowResultsForCategory')
        .mockReturnValueOnce(mockShowResultsForCategory)
      render(<Search />)
      await act(async () => {})

      const categoryButton = screen.getByText('Spectacles')

      fireEvent.press(categoryButton)

      expect(mockShowResultsForCategory).toHaveBeenCalledWith(SearchGroupNameEnumv2.SPECTACLES)
    })
  })

  describe('When search executed', () => {
    beforeEach(() => {
      mockSearchState = { ...mockSearchState, view: SearchView.Results, query: 'la fnac' }
    })

    it('should show search results', async () => {
      render(<Search />)
      await act(async () => {})

      expect(screen.getByTestId('searchResults')).toBeOnTheScreen()
    })

    it('should navigate to the search filter page when pressing the search filter button', async () => {
      render(<Search />)

      const searchFilterButton = screen.getByTestId('Voir tous les filtres\u00a0: 3 filtres actifs')
      fireEvent.press(searchFilterButton)

      const navScreen = 'SearchFilter'

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(navScreen, undefined)
      })
    })
  })
})
