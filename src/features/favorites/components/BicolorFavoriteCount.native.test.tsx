import { rest } from 'msw'
import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, waitFor } from 'tests/utils'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('BicolorFavoriteCount component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render non connected icon', async () => {
    const { queryByTestId } = renderBicolorFavoriteCount({ isLoggedIn: false })

    await waitFor(() => {
      expect(queryByTestId('bicolor-favorite-count')).toBeNull()
    })
  })

  it('should render connected icon', async () => {
    const { getByTestId } = renderBicolorFavoriteCount({ isLoggedIn: true })

    await waitFor(() => {
      expect(getByTestId('bicolor-favorite-count')).toBeTruthy()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    const { getByText } = renderBicolorFavoriteCount({ isLoggedIn: true, count: 10000 })

    await waitFor(() => {
      expect(getByText('99')).toBeTruthy()
    })
  })

  it('should show nbFavorites within badge', async () => {
    const { getByText } = renderBicolorFavoriteCount({ isLoggedIn: true })

    await waitFor(() => {
      expect(getByText(defaultOptions.count.toString())).toBeTruthy()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    const { getByText } = renderBicolorFavoriteCount({ isLoggedIn: true, count: 0 })
    await waitFor(() => {
      expect(getByText('0')).toBeTruthy()
    })
  })

  it('should not show nbFavorites within badge when offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const renderAPI = renderBicolorFavoriteCount({ isLoggedIn: true, count: 10 })
    await waitFor(() => {
      expect(renderAPI.queryByTestId('bicolor-favorite-count')).toBeFalsy()
    })
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
