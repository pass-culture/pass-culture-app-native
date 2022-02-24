import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'
import { render } from 'tests/utils'

import { SearchResults } from '../SearchResults'

jest.mock('react-query')
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(),
}))
const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
let mockHasNextPage = true
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

describe('SearchResults component', () => {
  it('should log SearchScrollToPage when hitting the bottom of the page', () => {
    const { getByTestId } = render(<SearchResults />, { wrapper: NavigationContainer })
    const flatlist = getByTestId('searchResultsFlatlist')

    mockData.pages.push({ hits: [], page: 1, nbHits: 0 })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1)

    mockData.pages.push({ hits: [], page: 2, nbHits: 0 })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2)
  })

  it('should not log SearchScrollToPage when hitting the bottom of the page if no more results', () => {
    mockHasNextPage = false
    const { getByTestId } = render(<SearchResults />, { wrapper: NavigationContainer })
    const flatlist = getByTestId('searchResultsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })
})
