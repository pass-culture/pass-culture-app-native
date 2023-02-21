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
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { FavoritesResults } from './FavoritesResults'

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

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
  it('should show no result message when list is empty', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()
    const button = screen.getByText('Découvrir le catalogue')
    const sortByButton = screen.queryByText('Trier')
    expect(button).toBeTruthy()
    expect(sortByButton).toBeFalsy()
  })

  it('should show favorite placeholder on init', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()
    const container = screen.getByTestId('FavoritesResultsPlaceHolder')
    expect(container).toBeTruthy()
  })

  it('should show number of result and sortBy button', () => {
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
    const container = screen.getByText(`${paginatedFavoritesResponseSnap.nbFavorites} favoris`)
    expect(container).toBeTruthy()
    const sortByButton = screen.getByText('Trier')
    expect(sortByButton).toBeTruthy()
  })

  it('should show favorite list banner when the user hasnt already seen it', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderFavoritesResults()

    expect(await screen.findByText('Crée une liste de favoris')).toBeTruthy()
  })

  it('should not show favorite list banner when the user has already seen the fake door', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    storage.saveObject('has_seen_fav_list_fake_door', true)
    renderFavoritesResults()

    await waitFor(() => {
      expect(screen.queryByText('Crée une liste de favoris')).toBeFalsy()
    })
  })
})

function renderFavoritesResults() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
