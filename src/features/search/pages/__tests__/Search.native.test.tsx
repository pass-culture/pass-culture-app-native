import React from 'react'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { Search } from 'features/search/pages/Search'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import * as useShowResultsForCategory from 'features/search/pages/useShowResultsForCategory'
import { SearchState, SearchView } from 'features/search/types'
import * as useFilterCountAPI from 'features/search/utils/useFilterCount'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent, superFlushWithAct } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockDispatchStagedSearch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({
    searchState: mockStagedSearchState,
    dispatch: mockDispatchStagedSearch,
  }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

jest.mock('react-query')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()

jest.mock('features/search/pages/useSearchResults', () => ({
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
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
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

describe('Search component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render Search', () => {
    expect(render(<Search />)).toMatchSnapshot()
  })

  it('should handle coming from "See More" correctly', () => {
    render(<Search />)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {},
    })
  })

  describe('When offline', () => {
    it('should display offline page', () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      const renderAPI = render(<Search />)
      expect(renderAPI.queryByText('Pas de réseau internet')).toBeTruthy()
    })
  })

  describe('When search not executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Landing } })
    })

    it('should display categories buttons', () => {
      const { getByTestId } = render(<Search />, { wrapper: SearchWrapper })

      const categoriesButtons = getByTestId('categoriesButtons')

      expect(categoriesButtons).toBeTruthy()
    })

    it('should show results for a category when pressing a category button', async () => {
      const mockShowResultsForCategory = jest.fn()
      jest
        .spyOn(useShowResultsForCategory, 'useShowResultsForCategory')
        .mockReturnValueOnce(mockShowResultsForCategory)
      const { findByText } = render(<Search />)

      const categoryButton = await findByText('Spectacles')
      await fireEvent.press(categoryButton)

      expect(mockShowResultsForCategory).toHaveBeenCalledWith(SearchGroupNameEnumv2.SPECTACLES)
    })

    it('should show search box with label', () => {
      const { queryByTestId } = render(<Search />)
      expect(queryByTestId('searchBoxWithLabel')).toBeTruthy()
    })
  })

  describe('When search executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Results, query: 'la fnac' } })
    })

    it('should show search box without label', async () => {
      const { queryByTestId } = render(<Search />)
      await superFlushWithAct()
      expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
    })

    it('should show search results', async () => {
      const { queryByTestId } = render(<Search />)
      await superFlushWithAct()
      expect(queryByTestId('searchResults')).toBeTruthy()
    })

    it('should navigate to the search filter page when pressing the search filter button', async () => {
      const { findByTestId } = render(<Search />)

      const searchFilterButton = await findByTestId('searchFilterButton')
      await fireEvent.press(searchFilterButton)

      const screen = 'SearchFilter'
      const params = undefined
      expect(navigate).toHaveBeenCalledWith(screen, params)
    })

    it('should reinitialize the filters from the current one', async () => {
      const { findByTestId } = render(<Search />)

      const searchFilterButton = await findByTestId('searchFilterButton')
      await fireEvent.press(searchFilterButton)

      expect(mockDispatchStagedSearch).toHaveBeenCalledWith({
        type: 'SET_STATE_FROM_DEFAULT',
        payload: mockSearchState,
      })
    })
  })
})
