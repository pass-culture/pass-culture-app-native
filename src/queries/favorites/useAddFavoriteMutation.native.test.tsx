import React from 'react'
import { View } from 'react-native'

import { FavoriteResponse } from 'api/gen'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'
import {
  hideSnackBar,
  showErrorSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { useAddFavoriteMutation } from './useAddFavoriteMutation'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const offerId = 116656

jest.mock('ui/components/snackBar/SnackBarContext')

const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

mockedUseSnackBarContext.mockReturnValue({
  hideSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
  showErrorSnackBar,
})

describe('useAddFavoriteMutation', () => {
  it('should add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })

    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isLoading).toBeFalsy()

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

    expect(result.current.isLoading).toBeFalsy()

    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(showErrorSnackBar).toHaveBeenCalledWith({
        message: 'L’offre n’a pas été ajoutée à tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
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

    expect(result.current.isLoading).toBeFalsy()

    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(showErrorSnackBar).toHaveBeenCalledWith({
        message: 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})

const renderUseAddFavorite = (onSuccess?: (data?: FavoriteResponse | undefined) => void) => {
  const { result } = renderHook(() => useAddFavoriteMutation({ onSuccess }), {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <FavoritesWrapper>
          <View>{props.children}</View>
        </FavoritesWrapper>
      ),
  })
  return result
}
