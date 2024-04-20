import * as React from 'react'
import { View } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor, act } from 'tests/utils'

import { useRemoveFavorite } from './useRemoveFavorite'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

jest.unmock('react-query')

describe('useRemoveFavorite hook', () => {
  mockUseAuthContext.mockReturnValue({
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  })

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
