import React from 'react'

import { api } from 'api/api'
import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, waitFor, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

const postFavoritesSpy = jest.spyOn(api, 'postNativeV1MeFavorites')

describe('<AddToFavoriteButton />', () => {
  beforeEach(() => {
    mockServer.getApiV1<PaginatedFavoritesResponse>('/me/favorites', paginatedFavoritesResponseSnap)
  })

  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()
    })
  })

  it('should add favorite', async () => {
    mockServer.postApiV1<FavoriteResponse>('/me/favorites', favoriteResponseSnap)

    renderButton({
      offerId: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(postFavoritesSpy).toHaveBeenCalledTimes(1)
    })
  })
})

const renderButton = ({ offerId }: { offerId: number }) => {
  return render(reactQueryProviderHOC(<AddToFavoritesButton offerId={offerId} />))
}
