import mockdate from 'mockdate'
import React from 'react'
import { Keyboard } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { initialSearchState } from 'features/search/context/reducer'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, fireEvent, render, screen } from 'tests/utils'

const venue = mockedSuggestedVenue

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.CINEMA],
  venue,
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockHideSuggestions = jest.fn()
let mockIsFocusOnSuggestions = false
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
    hideSuggestions: mockHideSuggestions,
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

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

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
              value: SearchGroupNameEnumv2.CINEMA,
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
              value: SearchGroupNameEnumv2.CINEMA,
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

jest.mock('libs/subcategories/useSubcategories')

const TODAY_DATE = new Date('2023-09-25T00:00:00.000Z')

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

const searchId = uuidv4()

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockSetPlace = jest.fn()
const mockSetSelectedLocationMode = jest.fn()
const mockHasGeolocPosition = true
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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const mockedEmptyHistory = {
  filteredHistory: [],
  queryHistory: '',
  addToHistory: jest.fn(),
  removeFromHistory: jest.fn(),
  search: jest.fn(),
}

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SearchLanding />', () => {
  beforeEach(() => {
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  })

  afterEach(() => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.CINEMA],
      venue,
      priceRange: [0, 20],
    }
    mockIsFocusOnSuggestions = false
  })

  describe('When wipAppV2SearchLandingHeader feature flag deactivated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should render SearchLanding', async () => {
      render(<SearchLanding />)

      await screen.findByText('Rechercher')

      await act(() => {})

      expect(screen).toMatchSnapshot()
    })

    it('should not render gradient header', async () => {
      render(<SearchLanding />)

      await screen.findByText('Rechercher')

      expect(screen.queryByTestId('searchLandingHeader')).not.toBeOnTheScreen()
    })
  })

  describe('When App V2 feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should render V2 App Design SearchLanding', async () => {
      render(<SearchLanding />)

      await screen.findByText('Rechercher')

      await act(() => {})

      expect(screen).toMatchSnapshot()
    })
  })

  describe('When wipAppV2SearchLandingHeader feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should render gradient header', async () => {
      render(<SearchLanding />)

      await screen.findByText('Rechercher')

      expect(screen.getByTestId('searchLandingHeader')).toBeOnTheScreen()
    })
  })

  describe('When SearchLanding is focus on suggestions', () => {
    beforeEach(() => {
      mockIsFocusOnSuggestions = true
    })

    it('should display offer suggestions', async () => {
      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteOfferItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteOfferItem_2')).toBeOnTheScreen()
    })

    it('should display venue suggestions', async () => {
      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteVenueItem_2')).toBeOnTheScreen()
    })

    it('should handle venue press', async () => {
      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId('autocompleteVenueItem_1'))

      expect(analytics.logConsultVenue).toHaveBeenCalledWith({
        from: 'searchAutoComplete',
        venueId: 1,
      })
    })

    it('should hide suggestions when pressing a venue', async () => {
      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId('autocompleteVenueItem_1'))

      expect(mockHideSuggestions).toHaveBeenNthCalledWith(1)
    })

    it('should dismiss keyboard on scroll', async () => {
      const scrollEventBottom = {
        nativeEvent: {
          layoutMeasurement: { height: 1000 },
          contentOffset: { y: 900 },
          contentSize: { height: 1600 },
        },
      }
      const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')
      render(<SearchLanding />)
      await act(async () => {})

      const scrollView = screen.getByTestId('autocompleteScrollView')
      // 1st scroll to bottom => trigger
      scrollView.props.onScroll(scrollEventBottom)

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    it('should display search history when it has items', async () => {
      mockdate.set(TODAY_DATE)
      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.getByText('Historique de recherche')).toBeOnTheScreen()
    })

    it('should not display search history when it has no items', async () => {
      mockdate.set(TODAY_DATE)
      mockUseSearchHistory.mockReturnValueOnce(mockedEmptyHistory)
      mockUseSearchHistory.mockReturnValueOnce(mockedEmptyHistory)
      mockUseSearchHistory.mockReturnValueOnce(mockedEmptyHistory)

      render(<SearchLanding />)
      await act(async () => {})

      expect(screen.queryByText('Historique de recherche')).not.toBeOnTheScreen()
    })

    it('should dismiss the keyboard when pressing search history item', async () => {
      mockdate.set(TODAY_DATE)
      const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')
      render(<SearchLanding />)
      await act(async () => {})

      fireEvent.press(screen.getByText('manga'))

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    describe('should update state and execute the search with the history item', () => {
      it('When it has not category and native category', async () => {
        mockdate.set(TODAY_DATE)
        render(<SearchLanding />)
        await act(async () => {})

        fireEvent.press(screen.getByText('manga'))

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            query: 'manga',
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerCategories: [],
          },
        })
      })

      it('When it has category and native category', async () => {
        mockdate.set(TODAY_DATE)
        render(<SearchLanding />)
        await act(async () => {})

        fireEvent.press(screen.getByText('tolkien'))

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            query: 'tolkien',
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES],
            offerCategories: [SearchGroupNameEnumv2.LIVRES],
          },
        })
      })

      it('When it has only a category', async () => {
        mockdate.set(TODAY_DATE)
        render(<SearchLanding />)
        await act(async () => {})

        fireEvent.press(screen.getByText('foresti'))

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            query: 'foresti',
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
          },
        })
      })
    })
  })

  describe('When offline', () => {
    it('should display offline page', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockUseNetInfoContext.mockReturnValue({ isConnected: false })
      render(<SearchLanding />)

      expect(await screen.findByText('Pas de réseau internet')).toBeOnTheScreen()
    })
  })
})
