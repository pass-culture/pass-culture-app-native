import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { Search } from 'features/search/pages/Search'
import { SearchState } from 'features/search/types'
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

const mockSettings = {
  appEnableSearchHomepageRework: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
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

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(),
  useRoute: jest.fn().mockReturnValue({ params: {} }),
}))

describe('Search component', () => {
  it('should render Search', () => {
    expect(render(<Search />)).toMatchSnapshot()
  })

  it('should handle coming from "See More" correctly', () => {
    render(<Search />)
    expect(mockDispatch).toBeCalledWith({
      type: 'SET_STATE_FROM_NAVIGATE',
      payload: {},
    })
    expect(mockDispatch).toBeCalledWith({ type: 'SHOW_RESULTS', payload: true })
  })

  describe('When rework feature flag is not activated', () => {
    describe('When search not executed', () => {
      it('should show landing page', () => {
        mockSettings.appEnableSearchHomepageRework = false
        mockSearchState.showResults = false
        const { getByTestId } = render(<Search />)
        const searchLandingPage = getByTestId('searchLandingPage')
        expect(searchLandingPage).toBeTruthy()
      })

      it('should show search box without rework', () => {
        mockSettings.appEnableSearchHomepageRework = false
        mockSearchState.showResults = false
        const { queryByTestId } = render(<Search />)
        expect(queryByTestId('searchBoxWithoutRework')).toBeTruthy()
      })
    })

    it('should show search results when search executed', () => {
      mockSettings.appEnableSearchHomepageRework = false
      mockSearchState.showResults = true
      const { queryByTestId } = render(<Search />)
      expect(queryByTestId('searchResults')).toBeTruthy()
    })
  })

  describe('When rework feature flag is activated', () => {
    describe('When search not executed', () => {
      it('should show search box with label', () => {
        mockSettings.appEnableSearchHomepageRework = true
        mockSearchState.showResults = false
        const { queryByTestId } = render(<Search />)
        expect(queryByTestId('searchBoxWithLabel')).toBeTruthy()
      })

      it('should show view for recent searches and suggestions', async () => {
        mockSettings.appEnableSearchHomepageRework = true
        mockSearchState.showResults = false
        const { queryByTestId, getByPlaceholderText } = render(<Search />)

        const searchInput = getByPlaceholderText('Offre, artiste...')
        await fireEvent(searchInput, 'onFocus')

        expect(queryByTestId('recentsSearchesAndSuggestions')).toBeTruthy()
      })
    })

    describe('When search executed', () => {
      it('should show search box without label', () => {
        mockSettings.appEnableSearchHomepageRework = true
        mockSearchState.showResults = true
        const { queryByTestId } = render(<Search />)
        expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
      })

      it('should show search results', () => {
        mockSettings.appEnableSearchHomepageRework = true
        mockSearchState.showResults = true
        const { queryByTestId } = render(<Search />)
        expect(queryByTestId('searchResults')).toBeTruthy()
      })
    })
  })
})
