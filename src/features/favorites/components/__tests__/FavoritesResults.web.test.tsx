import React from 'react'
import { Text as MockText } from 'react-native'
import { QueryObserverSuccessResult, UseMutationResult } from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import {
  FavoriteMutationContext,
  useFavorites,
  useRemoveFavorite,
} from 'features/favorites/pages/useFavorites'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

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

const mockData = {
  nbFavorites: 0,
  favorites: [] as Array<FavoriteResponse>,
  page: 0,
} as PaginatedFavoritesResponse

describe('FavoritesResults component', () => {
  it('should show no result message when list is empty', () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseFavorites.mockReturnValue({
      data: mockData,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    const { getByText, queryByText } = renderFavoritesResults()
    const button = getByText('Découvrir le catalogue')
    const sortByButton = queryByText('Trier')
    expect(button).toBeTruthy()
    expect(sortByButton).toBeFalsy()
  })

  it('should show favorite placeholder on init', () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseFavorites.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    const { getByTestId } = renderFavoritesResults()
    const container = getByTestId('FavoritesResultsPlaceHolder')
    expect(container).toBeTruthy()
  })

  it('should show number of result and sortBy button', () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const mutate = jest.fn()
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseFavorites.mockReturnValue({
      data: paginatedFavoritesResponseSnap,
      isFetching: false,
    } as QueryObserverSuccessResult<PaginatedFavoritesResponse>)

    // eslint-disable-next-line local-rules/independant-mocks
    mockUseRemoveFavorites.mockReturnValue({
      mutate,
    } as unknown as UseMutationResult<EmptyResponse, Error, number, FavoriteMutationContext>)
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<FavoritesResults />))
    const container = getByText(`${paginatedFavoritesResponseSnap.nbFavorites} favoris`)
    expect(container).toBeTruthy()
    const sortByButton = getByText('Trier')
    expect(sortByButton).toBeTruthy()
  })
})

function renderFavoritesResults() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
