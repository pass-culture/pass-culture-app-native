import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

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

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

describe('SearchResults component', () => {
  beforeAll(() => {
    mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: true } })
  })

  it('should render correctly', () => {
    expect(render(<SearchResults />)).toMatchSnapshot()
  })

  it('should display categories list from a modal if desktop viewport', async () => {
    const { getByTestId, queryByTestId } = render(<SearchResults />, {
      theme: { isDesktopViewport: true, isMobileViewport: false },
    })

    const categoryButton = getByTestId('categoryButton')

    await fireEvent.click(categoryButton)

    expect(queryByTestId('categoriesModal')).toBeTruthy()
  })

  it('should not display categories list from a modal if mobile viewport', async () => {
    const { getByTestId, queryByTestId } = render(<SearchResults />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })

    const categoryButton = getByTestId('categoryButton')

    await fireEvent.click(categoryButton)

    expect(queryByTestId('categoriesModal')).toBeFalsy()
  })

  it('should redirect to the filters page when clicking on the category button if mobile viewport', async () => {
    const { getByTestId } = render(<SearchResults />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const categoryButton = getByTestId('categoryButton')

    await fireEvent.click(categoryButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchCategories')
  })
})
