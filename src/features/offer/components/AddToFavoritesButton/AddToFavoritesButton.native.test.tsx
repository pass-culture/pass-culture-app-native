import React from 'react'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { EmptyResponse } from 'libs/fetch'
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

const mockPostFavorite = jest.fn()

describe('<AddToFavoriteButton />', () => {
  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()
    })
  })

  it('should add favorite', async () => {
    renderButton({
      offerId: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(mockPostFavorite).toHaveBeenCalledTimes(1)
    })
  })
})

type Options = {
  offerId?: number
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
}

const defaultOptions = {
  offerId: 116656,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
}

const renderButton = (options?: Options) => {
  const { offerId, hasAddFavoriteError } = {
    ...defaultOptions,
    ...options,
  }

  if (hasAddFavoriteError) {
    mockServer.postApiV1<EmptyResponse>(`/me/favorites`, {
      responseOptions: { statusCode: 415, data: {} },
    })
  } else {
    mockPostFavorite()
    mockServer.getApiV1<PaginatedFavoritesResponse>(`/me/favorites`, paginatedFavoritesResponseSnap)
    mockServer.postApiV1<FavoriteResponse>(`/me/favorites`, {
      responseOptions: { statusCode: 200, data: favoriteResponseSnap },
    })
  }

  return render(reactQueryProviderHOC(<AddToFavoritesButton offerId={offerId} />))
}
