import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useFavorite } from './useFavorite'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useFavorite hook', () => {
  it('should get favorite from offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const { result } = renderHook(() => useFavorite({ offerId: favorite.offer.id }), {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        ...favorite,
        offer: {
          ...favorite.offer,
          date: favorite.offer.date,
        },
      })
    })
  })

  it('should not get favorite from offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const { result } = renderHook(() => useFavorite({ offerId: 99999 }), {
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
