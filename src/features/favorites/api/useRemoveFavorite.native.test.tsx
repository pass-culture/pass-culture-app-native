import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useRemoveFavorite } from './useRemoveFavorite'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

jest.unmock('react-query')

describe('useRemoveFavorite hook', () => {
  it('should remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveFavorite({ onError }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isLoading).toBeFalsy()

    result.current.mutate(favoriteId)

    await act(async () => {})

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
    const { result } = renderHook(() => useRemoveFavorite({ onError }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isLoading).toBeFalsy()

    result.current.mutate(favoriteId)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})
