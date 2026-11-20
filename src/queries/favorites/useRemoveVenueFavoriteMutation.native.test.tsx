import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { simulateBackendForVenue } from 'features/favorites/tests/simulateBackendForVenue'
import { useRemoveVenueFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

jest.unmock('@tanstack/react-query')

describe('useRemoveVenueFavoriteMutation', () => {
  it('should remove favorite', async () => {
    const favorite = paginatedVenueFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackendForVenue({
      id: favorite.venue.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveVenueFavoriteMutation({ onError }), {
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
    const favorite = paginatedVenueFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackendForVenue({
      id: favorite.venue.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })

    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveVenueFavoriteMutation({ onError }), {
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
