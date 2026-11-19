import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { simulateBackendForArtist } from 'features/favorites/tests/simulateBackendForArtist'
import { useRemoveArtistFavoriteMutation } from 'queries/favorites/useRemoveArtistFavoriteMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

jest.unmock('@tanstack/react-query')

describe('useRemoveArtistFavoriteMutation', () => {
  it('should remove favorite', async () => {
    const favorite = paginatedArtistFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackendForArtist({
      id: favorite.artist.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveArtistFavoriteMutation({ onError }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isPending).toBeFalsy()

    await act(async () => result.current.mutate(favoriteId))
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(onError).not.toHaveBeenCalled()
  })

  it('should fail to remove favorite', async () => {
    const favorite = paginatedArtistFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackendForArtist({
      id: favorite.artist.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveArtistFavoriteMutation({ onError }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate(favoriteId)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})
