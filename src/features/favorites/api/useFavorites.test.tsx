import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { useFavorites } from './useFavorites'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

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
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
      !hasAddFavoriteError
        ? res(ctx.status(200), ctx.json(favoriteResponseSnap))
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

describe('useFavorites hook', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it('should retrieve favorite data when logged in', async () => {
    simulateBackend()
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(true)

    await waitFor(() => {
      expect(result.current.data?.favorites.length).toEqual(
        paginatedFavoritesResponseSnap.favorites.length
      )
    })
  })

  it('should fail to fetch when not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(false)
  })

  it('should fail to fetch when logged in but offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(false)
  })
})
