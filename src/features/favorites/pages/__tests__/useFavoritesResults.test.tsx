import { renderHook } from '@testing-library/react-hooks'
import { act } from '@testing-library/react-native'
import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import {
  sortByAscendingPrice,
  sortByDistanceAroundMe,
  sortByIdDesc,
} from 'features/favorites/pages/utils/sorts'
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
    const { result } = renderHook(useFavoritesResults, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await act(async () => result.current.isSuccess)
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
      sortBy: 'RECENTLY_ADDED',
      position: null,
    })
    expect(paginated.favorites.length).toEqual(1)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[0].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 1,
      favoritesPerPage: 1,
      sortBy: 'RECENTLY_ADDED',
      position: null,
    })
    expect(paginated.favorites.length).toEqual(1)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[1].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 2,
      sortBy: 'RECENTLY_ADDED',
      position: null,
    })
    expect(paginated.favorites.length).toEqual(2)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[0].id)
    expect(paginated.favorites[1].id).toEqual(paginatedFavoritesResponseSnap.favorites[1].id)

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 1,
      favoritesPerPage: 2,
      sortBy: 'RECENTLY_ADDED',
      position: null,
    })
    expect(paginated.favorites.length).toEqual(2)
    expect(paginated.favorites[0].id).toEqual(paginatedFavoritesResponseSnap.favorites[2].id)
    expect(paginated.favorites[1].id).toEqual(paginatedFavoritesResponseSnap.favorites[3].id)
  })

  it('should get sorted favorites', async () => {
    const position = { latitude: 48.8584, longitude: 2.2945 } as GeoCoordinates
    mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true, setIsLoggedIn: jest.fn() }))
    let paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 1000,
      sortBy: 'RECENTLY_ADDED',
      position: null,
    })
    expect(paginated.favorites).toEqual(paginatedFavoritesResponseSnap.favorites.sort(sortByIdDesc))

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 1000,
      sortBy: 'ASCENDING_PRICE',
      position: null,
    })
    expect(paginated.favorites).toEqual(
      paginatedFavoritesResponseSnap.favorites.sort(sortByAscendingPrice)
    )

    paginated = await getPaginatedFavorites(paginatedFavoritesResponseSnap, {
      page: 0,
      favoritesPerPage: 1000,
      sortBy: 'AROUND_ME',
      position,
    })
    expect(paginated.favorites).toEqual(
      paginatedFavoritesResponseSnap.favorites.sort(sortByDistanceAroundMe(position))
    )
  })
})
