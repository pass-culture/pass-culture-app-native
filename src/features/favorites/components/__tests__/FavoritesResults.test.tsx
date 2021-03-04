import { render } from '@testing-library/react-native'
import React from 'react'

import { initialFavoritesState } from 'features/favorites/pages/reducer'

import { FavoritesResults } from '../FavoritesResults'

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

const mockData = { pages: [{ nbFavorites: 0, favorites: [], page: 0 }] }
let mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/favorites/pages/useFavorites', () => ({
  useFavorites: () => ({
    data: mockData,
    isFetching: false,
  }),
}))
jest.mock('features/favorites/pages/useFavoritesResults', () => ({
  useFavoritesResults: () => ({
    data: mockData,
    isFetching: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
  }),
}))

describe('FavoritesResults component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should log ScrollToPage when hitting the bottom of the page', () => {
    const { getByTestId } = render(<FavoritesResults />)
    const flatlist = getByTestId('favoritesResultsFlatlist')

    mockData.pages.push({ favorites: [], page: 1, nbFavorites: 0 })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)

    mockData.pages.push({ favorites: [], page: 2, nbFavorites: 0 })
    flatlist.props.onEndReached()
    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
  })

  it('should not log ScrollToPage when hitting the bottom of the page if no more results', () => {
    mockHasNextPage = false
    const { getByTestId } = render(<FavoritesResults />)
    const flatlist = getByTestId('favoritesResultsFlatlist')
    flatlist.props.onEndReached()
  })
})
