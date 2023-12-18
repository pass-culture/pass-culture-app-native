import React from 'react'
import { Text as MockText } from 'react-native'
import { QueryObserverSuccessResult, UseMutationResult } from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useFavorites, useRemoveFavorite } from 'features/favorites/api'
import { FavoriteMutationContext } from 'features/favorites/api/types'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils/web'

import { FavoritesResults } from './FavoritesResults'

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

jest.mock('features/favorites/api/useFavorites')
const mockUseFavorites = useFavorites as jest.MockedFunction<typeof useFavorites>

jest.mock('features/favorites/api/useRemoveFavorite')
const mockUseRemoveFavorites = useRemoveFavorite as jest.MockedFunction<typeof useRemoveFavorite>

jest.mock('features/bookOffer/pages/BookingOfferModal', () => ({
  BookingOfferModal() {
    const Text = MockText
    return <Text>BookingOfferModalMock</Text>
  },
}))

const mockData = {
  nbFavorites: 0,
  favorites: [] as Array<FavoriteResponse>,
  page: 0,
} as PaginatedFavoritesResponse

describe('FavoritesResults component', () => {
  it('should show no result message when list is empty', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()

    await act(async () => {}) // Warning: An update to FavoritesResults inside a test was not wrapped in act(...).

    await screen.findByText('Découvrir le catalogue')
    const sortByButton = screen.queryByText('Trier')

    expect(sortByButton).not.toBeInTheDocument()
  })

  it('should show favorite placeholder on init', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()

    await act(async () => {}) // Warning: An update to FavoritesResults inside a test was not wrapped in act(...).

    expect(await screen.findByTestId('FavoritesResultsPlaceHolder')).toBeInTheDocument()
  })

  it('should show number of result and sortBy button', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const mutate = jest.fn()
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: paginatedFavoritesResponseSnap,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    // eslint-disable-next-line local-rules/independent-mocks
    mockUseRemoveFavorites.mockReturnValue({
      mutate,
    } as unknown as UseMutationResult<EmptyResponse, Error, number, FavoriteMutationContext>)

    renderFavoritesResults()

    await act(async () => {}) // Warning: An update to FavoritesResults inside a test was not wrapped in act(...).

    const paginatedFavorites = await screen.findByText(`4 favoris`)
    const sortButton = screen.queryByText('Trier')

    expect(paginatedFavorites).toBeInTheDocument()
    expect(sortButton).toBeInTheDocument()
  })
})

function renderFavoritesResults() {
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
