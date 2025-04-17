import React from 'react'

import { api } from 'api/api'
import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const postFavoritesSpy = jest.spyOn(api, 'postNativeV1MeFavorites')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<AddToFavoriteButton />', () => {
  beforeEach(() => {
    mockServer.getApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
  })

  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()
    })
  })

  it('should add favorite', async () => {
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)

    renderButton({
      offerId: favoriteResponseSnap.offer.id,
    })

    await user.press(screen.getByText('Mettre en favori'))

    expect(postFavoritesSpy).toHaveBeenCalledTimes(1)
  })
})

const renderButton = ({ offerId }: { offerId: number }) => {
  return render(reactQueryProviderHOC(<AddToFavoritesButton offerId={offerId} />))
}
