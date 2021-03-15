import { act, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { BicolorFavoriteCount } from '../BicolorFavoriteCount'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('BicolorFavoriteCount component', () => {
  afterEach(jest.clearAllMocks)

  it('should render non connected icon', async () => {
    const { queryByTestId } = await renderBicolorFavoriteCount({ isLoggedIn: false })
    expect(queryByTestId('bicolor-favorite-count')).toBeFalsy()
  })

  it('should render connected icon', async () => {
    const { queryByTestId } = await renderBicolorFavoriteCount({ isLoggedIn: true })
    await act(async () => queryByTestId('bicolor-favorite-count'))
    expect(queryByTestId('bicolor-favorite-count')).toBeTruthy()
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    const { queryByText } = await renderBicolorFavoriteCount({
      isLoggedIn: true,
      favoritesResponse: {
        page: 1,
        nbFavorites: 10000,
        favorites: [],
      },
    })
    await act(async () => queryByText('99'))
    expect(queryByText('99')).toBeTruthy()
  })

  it('should show nbFavorites within badge', async () => {
    const { queryByText } = await renderBicolorFavoriteCount({
      isLoggedIn: true,
    })
    await act(async () => queryByText(paginatedFavoritesResponseSnap.nbFavorites.toString()))
    expect(queryByText(paginatedFavoritesResponseSnap.nbFavorites.toString())).toBeTruthy()
  })

  it('should show 0 within badge when no favorite', async () => {
    const { queryByText } = await renderBicolorFavoriteCount({
      isLoggedIn: true,
      favoritesResponse: {
        page: 1,
        nbFavorites: 0,
        favorites: [],
      },
    })
    await act(async () => queryByText('0'))
    expect(queryByText('0')).toBeTruthy()
  })
})

interface Options {
  isLoggedIn?: boolean
  favoritesResponse?: PaginatedFavoritesResponse
}

const defaultOptions = {
  isLoggedIn: false,
  favoritesResponse: paginatedFavoritesResponseSnap,
}

async function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { isLoggedIn, favoritesResponse } = { ...defaultOptions, ...options }
  server.use(
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (req, res, ctx) => res(ctx.status(200), ctx.json(favoritesResponse))
    )
  )
  mockUseAuthContext.mockReturnValue({ isLoggedIn, setIsLoggedIn: jest.fn() })
  const renderAPI = render(reactQueryProviderHOC(<BicolorFavoriteCount />))
  await superFlushWithAct(30)
  return renderAPI
}
