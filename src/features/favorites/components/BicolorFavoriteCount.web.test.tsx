import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils/web'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('libs/jwt')
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

describe('BicolorFavoriteCount component', () => {
  it('should render non connected icon', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: false })

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeInTheDocument()
  })

  it('should render connected icon', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitFor(() => {
      expect(screen.getByTestId('bicolor-favorite-count')).toBeInTheDocument()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 10000 })
    await waitFor(() => {
      expect(screen.getByText('99')).toBeInTheDocument()
    })
  })

  it('should show nbFavorites within badge', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitFor(() => {
      expect(screen.getByText(defaultOptions.count.toString())).toBeInTheDocument()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 0 })
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('should not show nbFavorites within badge when offline', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderBicolorFavoriteCount({ isLoggedIn: true, count: 10 })

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeInTheDocument()
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
  mockServer.getApi<{ count: number }>(`/v1/me/favorites/count`, { count })

  mockUseAuthContext.mockReturnValue({
    isLoggedIn,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  })
  return render(reactQueryProviderHOC(<BicolorFavoriteCount />))
}
