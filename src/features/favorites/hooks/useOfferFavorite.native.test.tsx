import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { useOfferFavorite } from 'features/favorites/hooks/useOfferFavorite'
import { simulateBackendForOffer } from 'features/favorites/tests/simulateBackendForOffer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useOfferFavorite hook', () => {
  it('should get favorite from offer id', async () => {
    const favorite = paginatedOfferFavoritesResponseSnap.favorites[0]
    simulateBackendForOffer({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    const { result } = renderHook(() => useOfferFavorite({ offerId: favorite.offer.id }), {
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
    const favorite = paginatedOfferFavoritesResponseSnap.favorites[0]
    simulateBackendForOffer({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const { result } = renderHook(() => useOfferFavorite({ offerId: 99999 }), {
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
