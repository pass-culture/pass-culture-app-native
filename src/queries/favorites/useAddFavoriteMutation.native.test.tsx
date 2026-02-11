import React from 'react'
import { View } from 'react-native'

import { FavoriteResponse } from 'api/gen'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { DefaultWrapper, renderHook, waitFor } from 'tests/utils'
import * as SnackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

import { useAddFavoriteMutation } from './useAddFavoriteMutation'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const mockSnackBarOpen = jest.spyOn(SnackBarStore.snackBarActions, 'open')

const offerId = 116656

describe('useAddFavoriteMutation', () => {
  it('should add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        ...favoriteResponseSnap,
        offer: {
          ...favoriteResponseSnap.offer,
          date: favoriteResponseSnap.offer.date,
        },
      })
    })
  })

  it('should show snack bar when fail to add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'L’offre n’a pas été ajoutée à tes favoris',
        'error'
      )
    })
  })

  it('should show snack bar when too many favorites when trying to add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: false,
      hasTooManyFavorites: true,
      hasRemoveFavoriteError: false,
    })
    const result = renderUseAddFavorite()

    expect(result.current.isPending).toBeFalsy()

    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        'error'
      )
    })
  })
})

const renderUseAddFavorite = (onSuccess?: (data?: FavoriteResponse | undefined) => void) => {
  const { result } = renderHook(() => useAddFavoriteMutation({ onSuccess }), {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <DefaultWrapper>
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        </DefaultWrapper>
      ),
  })
  return result
}
