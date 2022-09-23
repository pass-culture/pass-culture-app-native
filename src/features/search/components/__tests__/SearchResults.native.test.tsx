import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'
import { theme } from 'theme'

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

  it('should display location filter button', () => {
    const { queryByTestId } = render(<SearchResults />)

    expect(queryByTestId('locationButton')).toBeTruthy()
  })

  it('should update the staged search state with the actual search state', async () => {
    const { getByTestId } = render(<SearchResults />)
    const locationButton = getByTestId('locationButton')

    await fireEvent.press(locationButton)

    expect(mockDispatchStagedSearch).toHaveBeenCalledWith({
      type: 'SET_STATE_FROM_DEFAULT',
      payload: mockSearchState,
    })
  })

  it('should redirect to the filters page when clicking on the location button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const locationButton = getByTestId('locationButton')

    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter')
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const categoryButton = getByTestId('categoryButton')

    await fireEvent.press(categoryButton)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

  it('should display category filter button', () => {
    const { queryByTestId } = render(<SearchResults />)

    expect(queryByTestId('categoryButton')).toBeTruthy()
  })

  it('should display an icon and change color in category button when has category selected', () => {
    useRoute.mockReturnValueOnce({
      params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
    const { getByTestId } = render(<SearchResults />)

    const categoryButtonIcon = getByTestId('categoryButtonIcon')
    expect(categoryButtonIcon).toBeTruthy()

    const categoryButton = getByTestId('categoryButton')
    expect(categoryButton).toHaveStyle({ borderColor: theme.colors.primary })

    const categoryButtonLabel = getByTestId('categoryButtonLabel')
    expect(categoryButtonLabel).toHaveStyle({ color: theme.colors.primary })
  })

  it('should display price filter button', () => {
    const { queryByTestId } = render(<SearchResults />)

    expect(queryByTestId('priceButton')).toBeTruthy()
  })

  it('should open the prices filter modal when clicking on the prices filter button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const priceButton = getByTestId('priceButton')

    await fireEvent.press(priceButton)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

  it('should display an icon and change color in prices filter button when has prices filter selected', () => {
    useRoute.mockReturnValueOnce({
      params: { minPrice: '5' },
    })
    const { getByTestId } = render(<SearchResults />)

    const priceButtonIcon = getByTestId('priceButtonIcon')
    expect(priceButtonIcon).toBeTruthy()

    const priceButton = getByTestId('priceButton')
    expect(priceButton).toHaveStyle({ borderColor: theme.colors.primary })

    const priceButtonLabel = getByTestId('priceButtonLabel')
    expect(priceButtonLabel).toHaveStyle({ color: theme.colors.primary })
  })

  describe('When feature flag filter activated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: true } })
    })

    it('should display type filter button', () => {
      const { queryByTestId } = render(<SearchResults />)

      expect(queryByTestId('typeButton')).toBeTruthy()
    })

    it('should redirect to the general filters page when clicking on the type filter button', () => {
      const { getByTestId } = render(<SearchResults />)
      const typeButton = getByTestId('typeButton')

      fireEvent.press(typeButton)

      expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter')
    })

    it.each`
      type               | params
      ${'duo offer'}     | ${{ offerIsDuo: true }}
      ${'digital offer'} | ${{ offerTypes: { isDigital: true, isEvent: false, isThing: false } }}
      ${'event offer'}   | ${{ offerTypes: { isDigital: false, isEvent: true, isThing: false } }}
      ${'thing offer'}   | ${{ offerTypes: { isDigital: false, isEvent: false, isThing: true } }}
    `(
      'should display an icon and change color in type button when has $type selected',
      ({ params }) => {
        useRoute.mockReturnValueOnce({
          params,
        })
        const { getByTestId } = render(<SearchResults />)

        const typeButtonIcon = getByTestId('typeButtonIcon')
        expect(typeButtonIcon).toBeTruthy()

        const typeButton = getByTestId('typeButton')
        expect(typeButton).toHaveStyle({ borderColor: theme.colors.primary })

        const typeButtonLabel = getByTestId('typeButtonLabel')
        expect(typeButtonLabel).toHaveStyle({ color: theme.colors.primary })
      }
    )
  })

  describe('When feature flag filter desactivated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: false } })
    })

    it('should not display type filter button', () => {
      const { queryByTestId } = render(<SearchResults />)

      expect(queryByTestId('typeButton')).toBeNull()
    })
  })
})
