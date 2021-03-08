import { render } from '@testing-library/react-native'
import React from 'react'
import {
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  QueryObserverSuccessResult,
} from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import { useFavorites } from 'features/favorites/pages/useFavorites'
import {
  FakePaginatedFavoritesResponse,
  useFavoritesResults,
} from 'features/favorites/pages/useFavoritesResults'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { FavoritesResults } from '../FavoritesResults'

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/favorites/pages/useFavorites')
const mockUseFavorites = useFavorites as jest.MockedFunction<typeof useFavorites>

const mockData = {
  nbFavorites: 0,
  favorites: [] as Array<FavoriteResponse>,
  page: 0,
} as PaginatedFavoritesResponse
const mockDataPage = {
  pages: [] as Array<FakePaginatedFavoritesResponse>,
  pageParams: [],
} as InfiniteData<FakePaginatedFavoritesResponse>
let mockHasNextPage = true
const mockFetchNextPage = jest.fn()

jest.mock('features/favorites/pages/useFavoritesResults')
const mockUseFavoritesResults = useFavoritesResults as jest.MockedFunction<
  typeof useFavoritesResults
>

describe('FavoritesResults component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log ScrollToPage when hitting the bottom of the page', () => {
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)
    mockUseFavoritesResults.mockReturnValue(({
      data: mockDataPage,
      isFetching: false,
      hasNextPage: mockHasNextPage,
      fetchNextPage: mockFetchNextPage,
    } as unknown) as InfiniteQueryObserverSuccessResult<FakePaginatedFavoritesResponse>)
    const { getByTestId } = render(<FavoritesResults />)
    const flatlist = getByTestId('favoritesResultsFlatlist')

    mockDataPage.pages.push({
      favorites: [],
      page: 1,
      nbFavorites: 0,
      nbPages: 2,
      favoritesPerPage: 20,
    })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)

    mockDataPage.pages.push({
      favorites: [],
      page: 2,
      nbFavorites: 0,
      nbPages: 2,
      favoritesPerPage: 20,
    })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
  })

  it('should not log ScrollToPage when hitting the bottom of the page if no more results', () => {
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)
    mockUseFavoritesResults.mockReturnValue(({
      data: mockDataPage,
      isFetching: false,
      hasNextPage: mockHasNextPage,
      fetchNextPage: mockFetchNextPage,
    } as unknown) as InfiniteQueryObserverSuccessResult<FakePaginatedFavoritesResponse>)
    mockHasNextPage = false
    const { getByTestId } = render(<FavoritesResults />)
    const flatlist = getByTestId('favoritesResultsFlatlist')
    flatlist.props.onEndReached()
  })

  it('should show no result message when list is empty', () => {
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)
    mockUseFavoritesResults.mockReturnValue(({
      data: mockDataPage,
      isFetching: false,
      hasNextPage: mockHasNextPage,
      fetchNextPage: mockFetchNextPage,
    } as unknown) as InfiniteQueryObserverSuccessResult<FakePaginatedFavoritesResponse>)
    const { getByText, queryByText } = render(<FavoritesResults />)
    const button = getByText('Explorer les offres')
    const filterButton = queryByText('Filter')
    expect(button).toBeTruthy()
    expect(filterButton).toBeFalsy()
  })

  it('should show favorite placeholder on init', () => {
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: true,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)
    mockUseFavoritesResults.mockReturnValue(({
      data: null,
      isFetching: true,
      hasNextPage: mockHasNextPage,
      fetchNextPage: mockFetchNextPage,
    } as unknown) as InfiniteQueryObserverSuccessResult<FakePaginatedFavoritesResponse>)
    const { getByTestId } = render(<FavoritesResults />)
    const container = getByTestId('FavoritesResultsPlaceHolder')
    expect(container).toBeTruthy()
  })

  it('should show number of result and filter button', () => {
    mockUseFavorites.mockReturnValue({
      data: paginatedFavoritesResponseSnap,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)
    mockUseFavoritesResults.mockReturnValue(({
      data: { pages: [paginatedFavoritesResponseSnap] },
      isFetching: false,
      hasNextPage: mockHasNextPage,
      fetchNextPage: mockFetchNextPage,
    } as unknown) as InfiniteQueryObserverSuccessResult<FakePaginatedFavoritesResponse>)
    const { getByText } = render(reactQueryProviderHOC(<FavoritesResults />))
    const container = getByText(`${paginatedFavoritesResponseSnap.nbFavorites} favoris`)
    expect(container).toBeTruthy()
    const filterButton = getByText('Filtrer')
    expect(filterButton).toBeTruthy()
  })
})
