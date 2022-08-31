import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { SearchResults } from '../SearchResults'

jest.mock('react-query')

const mockSearchState = initialSearchState
const mockDispatchStagedSearch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatchStagedSearch,
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

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

describe('SearchResults component', () => {
  it('should render correctly', () => {
    expect(render(<SearchResults />)).toMatchSnapshot()
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', () => {
    const { getByTestId } = render(<SearchResults />)
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
    const { getByTestId } = render(<SearchResults />)
    const flatlist = getByTestId('searchResultsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })

  it('should display location button', () => {
    const { queryByTestId } = render(<SearchResults />)

    expect(queryByTestId('locationButton')).toBeTruthy()
  })

  it('should update the staged search state with the actual search state', async () => {
    const { getByTestId } = render(<SearchResults />)
    const locationButton = getByTestId('locationButton')

    await fireEvent.press(locationButton)

    expect(mockDispatchStagedSearch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: mockSearchState,
    })
  })

  it('should redirect to the filters page when clicking on the location button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const locationButton = getByTestId('locationButton')

    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter')
  })

  it('should redirect to the filters page when clicking on the category button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const categoryButton = getByTestId('categoryButton')

    await fireEvent.press(categoryButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchCategories')
  })

  it('should display category button', () => {
    const { queryByTestId } = render(<SearchResults />)

    expect(queryByTestId('categoryButton')).toBeTruthy()
  })

  it('should not display categories list from a modal when clicking on the category button', async () => {
    const { getByTestId, queryByTestId } = render(<SearchResults />)

    const categoryButton = getByTestId('categoryButton')

    await fireEvent.press(categoryButton)

    expect(queryByTestId('categoriesModal')).toBeFalsy()
  })

  describe('When feature flag filter activated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: true } })
    })
  })

  describe('When feature flag filter desactivated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: false } })
    })
  })
})
