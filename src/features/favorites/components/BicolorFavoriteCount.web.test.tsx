import { rest } from 'msw'
import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen, waitFor } from 'tests/utils/web'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('BicolorFavoriteCount component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render non connected icon', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: false })
    expect(screen.queryByTestId('bicolor-favorite-count')).toBeFalsy()
  })

  it('should render connected icon', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitFor(() => {
      expect(screen.getByTestId('bicolor-favorite-count')).toBeTruthy()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 10000 })
    await waitFor(() => {
      expect(screen.getByText('99')).toBeTruthy()
    })
  })

  it('should show nbFavorites within badge', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitFor(() => {
      expect(screen.getByText(defaultOptions.count.toString())).toBeTruthy()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 0 })
    await waitFor(() => {
      expect(screen.getByText('0')).toBeTruthy()
    })
  })

  it('should not show nbFavorites within badge when offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 10 })
    expect(screen.queryByTestId('bicolor-favorite-count')).toBeFalsy()
  })
})

interface Options {
  isLoggedIn?: boolean
  count?: number
}

const defaultOptions = {
  isLoggedIn: false,
  count: 4,
}

function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { isLoggedIn, count } = { ...defaultOptions, ...options }
  server.use(
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites/count`,
      (req, res, ctx) => res(ctx.status(200), ctx.json({ count }))
    )
  )
  mockUseAuthContext.mockReturnValue({
    isLoggedIn,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  })
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<BicolorFavoriteCount />))
}
