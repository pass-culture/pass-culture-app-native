import React from 'react'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import * as useShowResultsForCategory from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { Search } from 'features/search/pages/Search/Search'
import { SearchState, SearchView } from 'features/search/types'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent, waitFor } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
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
jest.mock('features/auth/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

jest.mock('react-instantsearch-hooks', () => ({
  ...jest.requireActual('react-instantsearch-hooks'),
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        offer: { name: 'Test1', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
      {
        objectID: '2',
        offer: { name: 'Test2', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
    ],
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
jest.mock('algoliasearch')
jest.mock('libs/algolia/analytics/InsightsMiddleware', () => ({
  InsightsMiddleware: () => null,
}))

describe('<Search/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render Search', async () => {
    const search = render(<Search />)

    await waitFor(() => {
      expect(search).toMatchSnapshot()
    })
  })

  it('should handle coming from "See More" correctly', async () => {
    render(<Search />)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {},
      })
    })
  })

  describe('When offline', () => {
    it('should display offline page', () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      const renderAPI = render(<Search />)
      expect(renderAPI.getByText('Pas de réseau internet')).toBeTruthy()
    })
  })

  describe('When search not executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Landing } })
    })

    it('should display categories buttons', async () => {
      const { getByTestId } = render(<Search />, { wrapper: SearchWrapper })

      const categoriesButtons = getByTestId('categoriesButtons')

      await waitFor(() => {
        expect(categoriesButtons).toBeTruthy()
      })
    })

    it('should show results for a category when pressing a category button', async () => {
      const mockShowResultsForCategory = jest.fn()
      jest
        .spyOn(useShowResultsForCategory, 'useShowResultsForCategory')
        .mockReturnValueOnce(mockShowResultsForCategory)
      const { getByText } = render(<Search />)

      const categoryButton = getByText('Spectacles')

      await waitFor(() => {
        fireEvent.press(categoryButton)
        expect(mockShowResultsForCategory).toHaveBeenCalledWith(SearchGroupNameEnumv2.SPECTACLES)
      })
    })
  })

  describe('When search executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Results, query: 'la fnac' } })
    })

    it('should show search results', async () => {
      const { getByTestId } = render(<Search />)
      await waitFor(() => {
        expect(getByTestId('searchResults')).toBeTruthy()
      })
    })

    it('should navigate to the search filter page when pressing the search filter button', async () => {
      const { getByTestId } = render(<Search />)

      const searchFilterButton = getByTestId('searchFilterButton')
      fireEvent.press(searchFilterButton)

      const screen = 'SearchFilter'
      const params = undefined

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(screen, params)
      })
    })

    it('should reinitialize the filters from the current one', async () => {
      const { getByTestId } = render(<Search />)

      const searchFilterButton = getByTestId('searchFilterButton')
      fireEvent.press(searchFilterButton)

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE_FROM_DEFAULT',
          payload: mockSearchState,
        })
      })
    })
  })
})
