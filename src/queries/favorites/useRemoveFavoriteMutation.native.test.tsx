import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useRemoveFavoriteMutation } from './useRemoveFavoriteMutation'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

jest.unmock('@tanstack/react-query')

describe('useRemoveFavoriteMutation', () => {
  it('should remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveFavoriteMutation({ onError }), {
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
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveFavoriteMutation({ onError }), {
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
