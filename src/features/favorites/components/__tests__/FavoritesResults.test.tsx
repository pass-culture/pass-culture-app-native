import { render } from '@testing-library/react-native'
import React from 'react'
import { Text as MockText } from 'react-native'
import {
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  QueryObserverSuccessResult,
  UseMutationResult,
} from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import {
  FavoriteMutationContext,
  useFavorites,
  useRemoveFavorite,
} from 'features/favorites/pages/useFavorites'
import {
  FakePaginatedFavoritesResponse,
  useFavoritesResults,
} from 'features/favorites/pages/useFavoritesResults'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
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
const mockUseRemoveFavorites = useRemoveFavorite as jest.MockedFunction<typeof useRemoveFavorite>

jest.mock('features/bookOffer/pages/BookingOfferModal', () => ({
  BookingOfferModal() {
    const Text = MockText
    return <Text>BookingOfferModalMock</Text>
  },
}))

jest.mock('libs/environment', () => ({
  env: {
    SHOULD_DISPLAY_FAVORITES_FILTER: true,
  },
}))

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
    const { getByTestId } = renderFavoritesResults()
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
    const { getByTestId } = renderFavoritesResults()
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
    const { getByText, queryByText } = renderFavoritesResults()
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
    const { getByTestId } = renderFavoritesResults()
    const container = getByTestId('FavoritesResultsPlaceHolder')
    expect(container).toBeTruthy()
  })

  it('should show number of result and filter button', () => {
    env.SHOULD_DISPLAY_FAVORITES_FILTER = true
    const mutate = jest.fn()
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
    mockUseRemoveFavorites.mockReturnValue(({
      mutate,
    } as unknown) as UseMutationResult<EmptyResponse, Error, number, FavoriteMutationContext>)
    const { getByText } = render(reactQueryProviderHOC(<FavoritesResults />))
    const container = getByText(`${paginatedFavoritesResponseSnap.nbFavorites} favoris`)
    expect(container).toBeTruthy()
    const filterButton = getByText('Filtrer')
    expect(filterButton).toBeTruthy()
  })

  it('should not display filter button', () => {
    env.SHOULD_DISPLAY_FAVORITES_FILTER = false
    const { queryByText } = render(reactQueryProviderHOC(<FavoritesResults />))
    const filterButton = queryByText('Filtrer')
    expect(filterButton).toBeFalsy()
  })
})

function renderFavoritesResults() {
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
