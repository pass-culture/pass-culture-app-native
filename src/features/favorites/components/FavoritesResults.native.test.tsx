import { QueryObserverSuccessResult, UseMutationResult } from '@tanstack/react-query'
import React from 'react'
import { Text as MockText } from 'react-native'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { useOfferFavoritesQuery } from 'features/favorites/queries'
import { FavoriteOfferMutationContext } from 'features/favorites/queries/types'
import { env } from 'libs/environment/env'
import { EmptyResponse } from 'libs/fetch'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoveOfferFavoriteMutation } from 'queries/favorites/useRemoveOfferFavoriteMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { FavoritesResults } from './FavoritesResults'

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/favorites/queries/useOfferFavoritesQuery')
const mockUseFavorites = useOfferFavoritesQuery as jest.MockedFunction<
  typeof useOfferFavoritesQuery
>
jest.mock('queries/favorites/useRemoveOfferFavoriteMutation')
const mockUseRemoveFavorites = useRemoveOfferFavoriteMutation as jest.MockedFunction<
  typeof useRemoveOfferFavoriteMutation
>

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

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('FavoritesResults component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should show no result message when list is empty', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()
    const button = await screen.findByText('Explorer')
    const sortByButton = screen.queryByText('Trier')

    expect(button).toBeTruthy()
    expect(sortByButton).not.toBeOnTheScreen()
  })

  it('should show favorite placeholder on init', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()
    const container = await screen.findByTestId('FavoritesResultsPlaceHolder')

    expect(container).toBeOnTheScreen()
  })

  it('should show number of result and sortBy button', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const mutate = jest.fn()
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: paginatedOfferFavoritesResponseSnap,
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    // eslint-disable-next-line local-rules/independent-mocks
    mockUseRemoveFavorites.mockReturnValue({
      mutate,
    } as unknown as UseMutationResult<EmptyResponse, Error, number, FavoriteOfferMutationContext>)
    renderFavoritesResults()
    const container = await screen.findByText(
      `${paginatedOfferFavoritesResponseSnap.nbFavorites} favoris`
    )

    expect(container).toBeOnTheScreen()

    const sortByButton = screen.getByText('Trier')

    expect(sortByButton).toBeOnTheScreen()
  })

  it('should display tabs panel when wipFavoritesHub FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: paginatedOfferFavoritesResponseSnap,
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()

    expect(await screen.findByLabelText('Types de favoris')).toBeOnTheScreen()
  })

  it('should not display tabs panel when wipFavoritesHub FF deactivated', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseFavorites.mockReturnValue({
      data: paginatedOfferFavoritesResponseSnap,
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    renderFavoritesResults()

    await screen.findByText(`${paginatedOfferFavoritesResponseSnap.nbFavorites} favoris`)

    expect(screen.queryByLabelText('Types de favoris')).not.toBeOnTheScreen()
  })
})

function renderFavoritesResults() {
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
