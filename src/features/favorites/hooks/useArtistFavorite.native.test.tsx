import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { useArtistFavorite } from 'features/favorites/hooks/useArtistFavorite'
import { simulateBackendForArtist } from 'features/favorites/tests/simulateBackendForArtist'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useArtistFavorite hook', () => {
  it('should get favorite from artist id', async () => {
    const favorite = paginatedArtistFavoritesResponseSnap.favorites[0]
    simulateBackendForArtist({
      id: favorite.artist.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const { result } = renderHook(() => useArtistFavorite({ artistId: favorite.artist.id }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => {
      expect(result.current).toEqual(favorite)
    })
  })

  it('should not get favorite from artist id', async () => {
    const favorite = paginatedArtistFavoritesResponseSnap.favorites[0]
    simulateBackendForArtist({
      id: favorite.artist.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const { result } = renderHook(() => useArtistFavorite({ artistId: '99999' }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })
})
