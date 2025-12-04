import { Hit } from '@algolia/client-search'
import { uniqBy } from 'lodash'
import mockdate from 'mockdate'
import React from 'react'
import { Keyboard } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { SearchState } from 'features/search/types'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { ILocationContext, Position } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

const venue = mockedSuggestedVenue

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.CINEMA],
  venue,
  priceRange: [0, 20],
}
const mockDispatch = jest.fn()

const DEFAULT_MOCK_USE_SEARCH = {
  searchState: mockSearchState,
  dispatch: mockDispatch,
  isFocusOnSuggestions: false,
  hideSuggestions: jest.fn(),
}
const mockUseSearch = jest.fn(() => DEFAULT_MOCK_USE_SEARCH)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const mockRefetch = jest.fn()
const mockFecthNextPage = jest.fn()
const initialSearchResults = {
  data: { pages: [{ offers: { page: 0 } }, { offers: { page: 1 } }] },
  hits: {
    offers: mockedAlgoliaResponse.hits.map(transformOfferHit('')),
    artists: uniqBy(
      mockedAlgoliaResponse.hits.flatMap((hit: Hit<AlgoliaOffer>) => hit.artists ?? []),
      'name'
    ),
    duplicatedOffers: [],
    venues: mockedAlgoliaResponse.hits.map((hit: Hit<AlgoliaOffer>) => ({
      ...hit.venue,
      _geoloc: hit._geoloc,
    })) as AlgoliaVenue[],
  },
  nbHits: mockedAlgoliaResponse.hits.length,
  isFetching: false,
  isLoading: false,
  hasNextPage: true,
  fetchNextPage: mockFecthNextPage,
  isFetchingNextPage: false,
  refetch: mockRefetch,
}

const mockUseSearchResults = jest.fn(() => initialSearchResults)
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => mockUseSearchResults(),
}))

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

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

jest.mock('queries/subcategories/useSubcategoriesQuery')

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
const DEFAULT_USER_LOCATION: Position | undefined = { latitude: 5.16186, longitude: -52.669736 }

const MOCKED_PLACE: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: DEFAULT_USER_LOCATION,
}

const getAroundPlaceUserPosition = ({
  geolocPosition,
}: {
  geolocPosition?: Position
}): Partial<ILocationContext> => ({
  setPlace: jest.fn(),
  onModalHideRef: { current: jest.fn() },
  setSelectedLocationMode: jest.fn(),
  userLocation: DEFAULT_USER_LOCATION,
  selectedLocationMode: LocationMode.AROUND_PLACE,
  geolocPosition,
  place: MOCKED_PLACE,
  selectedPlace: MOCKED_PLACE,
  hasGeolocPosition: false,
})

const mockUseLocation = jest.fn(() => getAroundPlaceUserPosition({}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockedEmptyHistory = {
  filteredHistory: [],
  queryHistory: '',
  addToHistory: jest.fn(),
  removeFromHistory: jest.fn(),
  search: jest.fn(),
}

const mockUseRemoteConfigQuery = jest.fn(() => ({
  data: { displayNewSearchHeader: false },
}))
jest.mock('libs/firebase/remoteConfig/queries/useRemoteConfigQuery', () => ({
  useRemoteConfigQuery: () => mockUseRemoteConfigQuery(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<SearchResults/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })
    mockUseLocation.mockReturnValue(
      getAroundPlaceUserPosition({ geolocPosition: { latitude: 123.34, longitude: 0.12238 } })
    )
  })

  afterEach(() => {
    mockUseSearch.mockReturnValue(DEFAULT_MOCK_USE_SEARCH)
  })

  it('should render SearchResults', async () => {
    render(reactQueryProviderHOC(<SearchResults />))

    await screen.findByText('Rechercher')

    expect(screen).toMatchSnapshot()
  })

  it('should refetch results when location changes', async () => {
    const { rerender } = render(reactQueryProviderHOC(<SearchResults />))

    await screen.findByTestId('searchResults')

    mockUseLocation.mockReturnValueOnce(
      getAroundPlaceUserPosition({ geolocPosition: { latitude: 999, longitude: 0.876 } })
    )

    rerender(reactQueryProviderHOC(<SearchResults />))

    await waitFor(() => expect(mockRefetch).toHaveBeenCalledTimes(1))
  })

  it('should fetch next page when end of list is reached', async () => {
    render(reactQueryProviderHOC(<SearchResults />))

    const flashList = await screen.findByTestId('searchResultsFlashlist')
    fireEvent(flashList, 'layout', {
      nativeEvent: {
        layout: { height: 2000, width: 400 },
      },
    })

    fireEvent.scroll(flashList, {
      nativeEvent: {
        layoutMeasurement: { height: 500 },
        contentOffset: { y: 1500 },
        contentSize: { height: 2000 },
      },
    })

    await waitFor(() => expect(mockFecthNextPage).toHaveBeenCalledTimes(1))
  })

  describe('When SearchResults is focus on suggestions', () => {
    beforeEach(() => {
      mockUseSearch.mockReturnValue({ ...DEFAULT_MOCK_USE_SEARCH, isFocusOnSuggestions: true })
    })

    it('should display offer suggestions', async () => {
      render(reactQueryProviderHOC(<SearchResults />))
      await screen.findByText('Rechercher')

      expect(screen.getByTestId('autocompleteOfferItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteOfferItem_2')).toBeOnTheScreen()
    })

    it('should display venue suggestions', async () => {
      render(reactQueryProviderHOC(<SearchResults />))

      await screen.findByText('Rechercher')

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteVenueItem_2')).toBeOnTheScreen()
    })

    it('should handle venue press', async () => {
      render(reactQueryProviderHOC(<SearchResults />))
      await screen.findByText('Rechercher')

      await user.press(screen.getByTestId('autocompleteVenueItem_1'))

      expect(analytics.logConsultVenue).toHaveBeenCalledWith({
        from: 'searchAutoComplete',
        venueId: '1',
      })
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
      render(reactQueryProviderHOC(<SearchResults />))

      await screen.findByText('Rechercher')

      const scrollView = screen.getByTestId('autocompleteScrollView')
      // 1st scroll to bottom => trigger
      scrollView.props.onScroll(scrollEventBottom)

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    it('should display search history when it has items', async () => {
      mockdate.set(TODAY_DATE)
      render(reactQueryProviderHOC(<SearchResults />))
      await screen.findByText('Rechercher')

      expect(screen.getByText('Historique de recherche')).toBeOnTheScreen()
    })

    it('should not display search history when it has not items', async () => {
      mockdate.set(TODAY_DATE)
      mockUseSearchHistory
        .mockReturnValueOnce(mockedEmptyHistory)
        .mockReturnValueOnce(mockedEmptyHistory)
        .mockReturnValueOnce(mockedEmptyHistory)
      render(reactQueryProviderHOC(<SearchResults />))
      await screen.findByText('Rechercher')

      expect(screen.queryByText('Historique de recherche')).not.toBeOnTheScreen()
    })

    it('should dismiss the keyboard when pressing search history item', async () => {
      mockdate.set(TODAY_DATE)
      const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')
      render(reactQueryProviderHOC(<SearchResults />))
      await screen.findByText('Rechercher')

      await user.press(screen.getByText('manga'))

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    describe('should update state and execute the search with the history item', () => {
      it('When it has not category and native category', async () => {
        mockdate.set(TODAY_DATE)
        render(reactQueryProviderHOC(<SearchResults />))
        await screen.findByText('Rechercher')

        await user.press(screen.getByText('manga'))

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
        render(reactQueryProviderHOC(<SearchResults />))
        await screen.findByText('Rechercher')

        await user.press(screen.getByText('tolkien'))

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
        render(reactQueryProviderHOC(<SearchResults />))
        await screen.findByText('Rechercher')

        await user.press(screen.getByText('foresti'))

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
      mockUseNetInfoContext
        .mockReturnValueOnce({ isConnected: false })
        .mockReturnValueOnce({ isConnected: false })
        .mockReturnValueOnce({ isConnected: false })
      render(reactQueryProviderHOC(<SearchResults />))

      await waitFor(() => {
        expect(screen.getByText('Pas de réseau internet')).toBeOnTheScreen()
      })
    })
  })

  describe('When searchId not defined', () => {
    beforeEach(() => {
      mockUseSearch.mockReturnValue({
        ...DEFAULT_MOCK_USE_SEARCH,
        searchState: { ...mockSearchState, searchId: undefined },
      })
    })

    afterEach(() => {
      mockUseSearch.mockReturnValue(DEFAULT_MOCK_USE_SEARCH)
    })

    it('should generate searchId and dispatch it in the state', async () => {
      render(reactQueryProviderHOC(<SearchResults />))

      await screen.findByText('Rechercher')

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_STATE',
        payload: { ...mockSearchState, searchId: 'testUuidV4' },
      })
    })
  })

  describe('When displayNewSearchHeader is enabled', () => {
    beforeAll(() => {
      mockUseRemoteConfigQuery.mockReturnValue({
        data: { displayNewSearchHeader: true },
      })
    })

    afterAll(() => {
      mockUseRemoteConfigQuery.mockReturnValue({
        data: { displayNewSearchHeader: false },
      })
    })

    it('should display back arrow when displayNewSearchHeader is true', async () => {
      render(reactQueryProviderHOC(<SearchResults />))

      await screen.findByText('Rechercher')

      expect(screen.getByTestId('icon-back')).toBeOnTheScreen()
    })

    describe('When input is focused', () => {
      beforeEach(() => {
        mockUseSearch.mockReturnValue({ ...DEFAULT_MOCK_USE_SEARCH, isFocusOnSuggestions: true })
      })

      it('should hide header', async () => {
        render(reactQueryProviderHOC(<SearchResults />))

        await screen.findByTestId('searchInput')

        expect(screen.queryByText('Rechercher')).not.toBeOnTheScreen()
      })
    })
  })
})
