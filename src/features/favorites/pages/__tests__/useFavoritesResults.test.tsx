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

import { getPaginatedFavorites, useFavoritesResults } from '../useFavoritesResults'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockPaginatedFavoritesResponseSnap = paginatedFavoritesResponseSnap
jest.mock('features/favorites/pages/useFavorites', () =>
  Object.assign(jest.requireActual('../../../../features/favorites/pages/useFavorites'), {
    useFavorites: () => ({
      data: mockPaginatedFavoritesResponseSnap,
    }),
  })
)

server.use(
  rest.get<Array<FavoriteResponse>>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
  )
)

describe('useFavoritesResults hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve favorite data', async () => {
    mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true, setIsLoggedIn: jest.fn() }))
    const { result, waitFor } = renderHook(useFavoritesResults, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => result.current.isSuccess)
    expect(result.current.isSuccess).toEqual(true)
    expect(result.current.data?.pages[0].nbFavorites).toEqual(
      paginatedFavoritesResponseSnap.nbFavorites
    )
  })

  it('should get fake paginated favorites', async () => {
    mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true, setIsLoggedIn: jest.fn() }))
    let paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 1,
    })
    expect(paginated.favorites.length).toEqual(1)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[0].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 1,
      favoritesPerPage: 1,
    })
    expect(paginated.favorites.length).toEqual(1)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[1].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 2,
    })
    expect(paginated.favorites.length).toEqual(2)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[0].id)
    expect(paginated.favorites[1].id).toEqual(paginatedFavoritesResponseSnap.favorites[1].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 1,
      favoritesPerPage: 2,
    })
    expect(paginated.favorites.length).toEqual(2)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[2].id)
    expect(paginated.favorites[1].id).toEqual(paginatedFavoritesResponseSnap.favorites[3].id)
  })
})
