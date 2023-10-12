import mockdate from 'mockdate'
import React from 'react'
import { Keyboard } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import * as useShowResultsForCategory from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { Search } from 'features/search/pages/Search/Search'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent, waitFor, act, screen } from 'tests/utils'

const venue: Venue = mockedSuggestedVenues[0]

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

jest.mock('react-query')

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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

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

describe('<Search/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render Search', async () => {
    render(<Search />)

    await screen.findByText('Rechercher')

    expect(screen).toMatchSnapshot()
  })

  it('should handle coming from "See More" correctly', async () => {
    render(<Search />)
    await act(async () => {})

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {},
    })
  })

  describe('When search view is suggestions', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(true)
      useRoute.mockReturnValue({ params: { view: SearchView.Suggestions } })
    })

    it('should display offer suggestions', async () => {
      render(<Search />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteOfferItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteOfferItem_2')).toBeOnTheScreen()
    })

    it('should not display venue suggestions when wipEnableVenuesInSearchResults feature flag deactivated', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      useFeatureFlagSpy.mockReturnValue(false)
      render(<Search />)
      await act(async () => {})

      expect(screen.queryByTestId('autocompleteVenueItem_1')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('autocompleteVenueItem_2')).not.toBeOnTheScreen()
    })

    it('should display venue suggestions when wipEnableVenuesInSearchResults feature flag activated', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<Search />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()
      expect(screen.getByTestId('autocompleteVenueItem_2')).toBeOnTheScreen()
    })

    it('should handle venue press', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<Search />)
      await act(async () => {})

      expect(screen.getByTestId('autocompleteVenueItem_1')).toBeOnTheScreen()

      await fireEvent.press(screen.getByTestId('autocompleteVenueItem_1'))

      expect(analytics.logConsultVenue).toHaveBeenCalledWith({
        from: 'searchAutoComplete',
        venueId: 1,
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
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<Search />)
      await act(async () => {})

      const scrollView = screen.getByTestId('autocompleteScrollView')
      // 1st scroll to bottom => trigger
      scrollView.props.onScroll(scrollEventBottom)

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    it('should display search history when it has items', async () => {
      mockdate.set(TODAY_DATE)
      render(<Search />)
      await act(async () => {})

      expect(screen.getByText('Historique de recherche')).toBeOnTheScreen()
    })

    it('should not display search history when it has not items', async () => {
      mockdate.set(TODAY_DATE)
      mockUseSearchHistory.mockReturnValueOnce({
        filteredHistory: [],
        queryHistory: '',
        addToHistory: jest.fn(),
        removeFromHistory: jest.fn(),
        search: jest.fn(),
      })
      render(<Search />)
      await act(async () => {})

      expect(screen.queryByText('Historique de recherche')).not.toBeOnTheScreen()
    })

    it('should dismiss the keyboard when pressing search history item', async () => {
      mockdate.set(TODAY_DATE)
      const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')
      render(<Search />)
      await act(async () => {})

      fireEvent.press(screen.getByText('manga'))

      expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
    })

    describe('should navigate and execute the search with the history item', () => {
      it('When it has not category and native category', async () => {
        mockdate.set(TODAY_DATE)
        render(<Search />)
        await act(async () => {})

        fireEvent.press(screen.getByText('manga'))

        expect(navigate).toHaveBeenNthCalledWith(
          1,
          ...getTabNavConfig('Search', {
            ...mockSearchState,
            query: 'manga',
            view: SearchView.Results,
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerCategories: [],
          })
        )
      })

      it('When it has category and native category', async () => {
        mockdate.set(TODAY_DATE)
        render(<Search />)
        await act(async () => {})

        fireEvent.press(screen.getByText('tolkien'))

        expect(navigate).toHaveBeenNthCalledWith(
          1,
          ...getTabNavConfig('Search', {
            ...mockSearchState,
            query: 'tolkien',
            view: SearchView.Results,
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES],
            offerCategories: [SearchGroupNameEnumv2.LIVRES],
          })
        )
      })

      it('When it has only a category', async () => {
        mockdate.set(TODAY_DATE)
        render(<Search />)
        await act(async () => {})

        fireEvent.press(screen.getByText('foresti'))

        expect(navigate).toHaveBeenNthCalledWith(
          1,
          ...getTabNavConfig('Search', {
            ...mockSearchState,
            query: 'foresti',
            view: SearchView.Results,
            searchId,
            isFromHistory: true,
            isAutocomplete: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
          })
        )
      })
    })
  })

  it.each([SearchView.Landing, SearchView.Results])(
    'should not display suggestions when search view is not suggestions',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } })
      render(<Search />)
      await act(async () => {})

      expect(screen.queryByTestId('autocompleteOfferItem_1')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('autocompleteOfferItem_2')).not.toBeOnTheScreen()
    }
  )

  describe('When offline', () => {
    it('should display offline page', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      render(<Search />)
      await act(async () => {})
      expect(screen.getByText('Pas de réseau internet')).toBeOnTheScreen()
    })
  })

  describe('When search not executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Landing } })
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
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Results, query: 'la fnac' } })
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
      const params = { query: 'la fnac', view: SearchView.Results }

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(navScreen, params)
      })
    })

    it('should reinitialize the filters from the current one', async () => {
      render(<Search />)

      const searchFilterButton = screen.getByTestId('Voir tous les filtres\u00a0: 3 filtres actifs')
      await act(async () => {
        fireEvent.press(searchFilterButton)
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: { query: 'la fnac', view: SearchView.Results },
      })
    })
  })
})
