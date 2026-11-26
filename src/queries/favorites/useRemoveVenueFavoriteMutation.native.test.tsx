import React from 'react'
import { View } from 'react-native'

import { useFavoritesTabViews } from 'features/favorites/context/FavoritesTabViewsProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoriteType } from 'features/favorites/enum'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { simulateBackendForVenue } from 'features/favorites/tests/simulateBackendForVenue'
import { storage } from 'libs/storage'
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
    await storage.saveObject('unviewed_favorite_venue_ids', [favoriteId, favoriteId + 1])
    simulateBackendForVenue({
      id: favorite.venue.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onError = jest.fn()
    const { result } = renderHook(
      () => ({
        mutation: useRemoveVenueFavoriteMutation({ onError }),
        favoritesTabViews: useFavoritesTabViews(),
      }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    await waitFor(() => expect(result.current.favoritesTabViews.isReady).toBe(true))

    expect(result.current.mutation.isPending).toBeFalsy()

    act(() => result.current.mutation.mutate(favoriteId))
    await waitFor(() => expect(result.current.mutation.isSuccess).toEqual(true))

    expect(onError).not.toHaveBeenCalled()
    expect(result.current.favoritesTabViews.unviewedFavorites[FavoriteType.VENUE]).toEqual([
      favoriteId + 1,
    ])
    expect(await storage.readObject('unviewed_favorite_venue_ids')).toEqual([favoriteId + 1])
  })

  it('should fail to remove favorite', async () => {
    const favorite = paginatedVenueFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    await storage.saveObject('unviewed_favorite_venue_ids', [favoriteId, favoriteId + 1])
    simulateBackendForVenue({
      id: favorite.venue.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })

    const onError = jest.fn()
    const { result } = renderHook(
      () => ({
        mutation: useRemoveVenueFavoriteMutation({ onError }),
        favoritesTabViews: useFavoritesTabViews(),
      }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    await waitFor(() => expect(result.current.favoritesTabViews.isReady).toBe(true))

    expect(result.current.mutation.isPending).toBeFalsy()

    result.current.mutation.mutate(favoriteId)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
    })

    expect(result.current.favoritesTabViews.unviewedFavorites[FavoriteType.VENUE]).toEqual([
      favoriteId,
      favoriteId + 1,
    ])
    expect(await storage.readObject('unviewed_favorite_venue_ids')).toEqual([
      favoriteId,
      favoriteId + 1,
    ])
  })
})
