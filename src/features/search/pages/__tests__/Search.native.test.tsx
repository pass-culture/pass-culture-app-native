import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { Search } from 'features/search/pages/Search'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import * as useShowResultsForCategory from 'features/search/pages/useShowResultsForCategory'
import { SearchState, SearchView } from 'features/search/types'
import { useNetInfo as useNetInfoDefault } from 'libs/network/useNetInfo'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnum.CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockStagedSearchState, dispatch: jest.fn() }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

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
const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('Search component', () => {
  mockUseNetInfo.mockReturnValue({ isConnected: true })

  it('should render Search', () => {
    expect(render(<Search />)).toMatchSnapshot()
  })

  it('should handle coming from "See More" correctly', () => {
    render(<Search />)
    expect(mockDispatch).toBeCalledWith({
      type: 'SET_STATE_FROM_NAVIGATE',
      payload: {},
    })
  })

  describe('When offline', () => {
    it('should display offline page', () => {
      mockUseNetInfo.mockReturnValueOnce({ isConnected: false })
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
      const { getByText } = render(<Search />)

      const categoryButton = getByText('Spectacles')
      await fireEvent.press(categoryButton)

      expect(mockShowResultsForCategory).toHaveBeenCalledWith(SearchGroupNameEnum.SPECTACLE)
    })

    it('should show search box with label', () => {
      const { queryByTestId } = render(<Search />)
      expect(queryByTestId('searchBoxWithLabel')).toBeTruthy()
    })

    it.skip('should show view for recent searches and suggestions', async () => {
      const { queryByTestId, getByPlaceholderText } = render(<Search />)

      const searchInput = getByPlaceholderText('Offre, artiste...')
      await fireEvent(searchInput, 'onFocus')

      expect(queryByTestId('recentsSearchesAndSuggestions')).toBeTruthy()
    })
  })

  describe('When search executed', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Results, query: 'la fnac' } })
    })

    it('should show search box without label', () => {
      const { queryByTestId } = render(<Search />)
      expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
    })

    it('should show search results', () => {
      const { queryByTestId } = render(<Search />)
      expect(queryByTestId('searchResults')).toBeTruthy()
    })
  })
})
