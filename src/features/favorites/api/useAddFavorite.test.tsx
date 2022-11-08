import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'

import { FavoriteResponse, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import {
  addFavoriteJsonResponseSnap,
  paginatedFavoritesResponseSnap,
} from 'features/favorites/fixtures/favoritesResponse'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { useAddFavorite } from './useAddFavorite'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('features/auth/AuthContext')
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

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: offerId,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }
  server.use(
    rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    ),
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
    ),
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) => {
      if (hasTooManyFavorites) {
        return res(ctx.status(400), ctx.json({ code: 'MAX_FAVORITES_REACHED' }))
      } else if (hasAddFavoriteError) {
        return res(ctx.status(422), ctx.json({}))
      } else {
        return res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
      }
    }),
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      (req, res, ctx) =>
        !hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422), ctx.json({}))
    )
  )
}

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
    })
    const onSuccess = jest.fn()
    const result = renderUseAddFavorite(onSuccess)

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate({ offerId })

    await waitFor(() => {
      expect(onSuccess).toBeCalledWith({
        ...addFavoriteJsonResponseSnap,
        offer: {
          ...addFavoriteJsonResponseSnap.offer,
          date: addFavoriteJsonResponseSnap.offer.date,
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
