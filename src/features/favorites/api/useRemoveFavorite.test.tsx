import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { FavoriteResponse, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import {
  addFavoriteJsonResponseSnap,
  paginatedFavoritesResponseSnap,
} from 'features/favorites/fixtures/favoritesResponse'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, superFlushWithAct } from 'tests/utils'

import { useRemoveFavorite } from './useRemoveFavorite'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

jest.unmock('react-query')
const offerId = 116656

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: offerId,
  hasAddFavoriteError: false,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError } = { ...defaultOptions, ...options }
  server.use(
    rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    ),
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
    ),
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
      !hasAddFavoriteError
        ? res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
        : res(ctx.status(422), ctx.json({}))
    ),
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      (req, res, ctx) =>
        !hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422), ctx.json({}))
    )
  )
}

describe('useRemoveFavorite hook', () => {
  it('should remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveFavorite({ onError }), {
      wrapper: (props) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate(favoriteId)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(onError).not.toBeCalled()
    })
  })

  it('should fail to remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const onError = jest.fn()
    const { result } = renderHook(() => useRemoveFavorite({ onError }), {
      wrapper: (props) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate(favoriteId)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(onError).toBeCalled()
    })
  })
})
