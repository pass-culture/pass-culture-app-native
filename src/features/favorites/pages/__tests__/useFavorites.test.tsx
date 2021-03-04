import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { useFavorites } from '../useFavorites'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

server.use(
  rest.get<Array<FavoriteResponse>>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
  )
)

describe('useFavorites hook', () => {
  it('should retrieve favorite data when logged in', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const { result, waitFor } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })
    expect(result.current.isFetching).toEqual(true)
    await waitFor(() => result.current.isSuccess)
    expect(result.current.isSuccess).toEqual(true)
    expect(result.current.data?.favorites.length).toEqual(
      paginatedFavoritesResponseSnap.favorites.length
    )
  })
  it('should return null when not logged in', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))
    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })
    expect(result.current.isFetching).toEqual(false)
  })
})
