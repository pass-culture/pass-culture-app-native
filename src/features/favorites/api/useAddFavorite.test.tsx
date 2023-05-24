import * as React from 'react'
import { View } from 'react-native'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { useAddFavorite } from './useAddFavorite'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

jest.unmock('react-query')
const offerId = 116656

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))

const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

mockedUseSnackBarContext.mockReturnValue({
  hideSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
  showErrorSnackBar,
})

describe('useAddFavorite hook', () => {
  it('should add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(onSuccess).toBeCalledWith({
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
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
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
})
it('should show snack bar when too many favorites when trying to add favorite', async () => {
  simulateBackend({
    id: offerId,
    hasAddFavoriteError: false,
    hasTooManyFavorites: true,
    hasRemoveFavoriteError: false,
  })
  mockUseAuthContext.mockReturnValueOnce({
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
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

const renderUseAddFavorite = (onSuccess?: (data?: FavoriteResponse | undefined) => void) => {
  const { result } = renderHook(() => useAddFavorite({ onSuccess }), {
    wrapper: (props) =>
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <FavoritesWrapper>
          <View>{props.children}</View>
        </FavoritesWrapper>
      ),
  })
  return result
}
