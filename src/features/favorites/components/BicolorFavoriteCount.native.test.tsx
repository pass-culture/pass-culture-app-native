import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BicolorFavoriteCountV2 } from 'features/favorites/components/BicolorFavoriteCountV2'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, waitFor, screen } from 'tests/utils'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe.each`
  v2       | component
  ${false} | ${'BicolorFavoriteCount'}
  ${true}  | ${'BicolorFavoriteCountV2'}
`('$component component', ({ v2 }) => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  const componentTestId = `bicolor-favorite-count${v2 ? '-v2' : ''}`

  it('should render non connected icon', async () => {
    renderBicolorFavoriteCount({ v2, isLoggedIn: false })

    await waitFor(() => {
      expect(screen.queryByTestId(componentTestId)).not.toBeOnTheScreen()
    })
  })

  it('should render connected icon', async () => {
    renderBicolorFavoriteCount({ v2, isLoggedIn: true })

    await waitFor(() => {
      expect(screen.getByTestId(componentTestId)).toBeOnTheScreen()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    renderBicolorFavoriteCount({ v2, isLoggedIn: true, count: 10000 })

    await waitFor(() => {
      expect(screen.getByText('99+')).toBeOnTheScreen()
    })
  })

  it('should show nbFavorites within badge', async () => {
    renderBicolorFavoriteCount({ v2, isLoggedIn: true })

    await waitFor(() => {
      expect(screen.getByText(defaultOptions.count.toString())).toBeOnTheScreen()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    renderBicolorFavoriteCount({ v2, isLoggedIn: true, count: 0 })
    await waitFor(() => {
      expect(screen.getByText('0')).toBeOnTheScreen()
    })
  })

  it('should not show nbFavorites within badge when offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderBicolorFavoriteCount({ v2, isLoggedIn: true, count: 10 })
    await act(async () => {})

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeOnTheScreen()
  })
})

interface Options {
  v2: boolean
  isLoggedIn: boolean
  count?: number
}

const defaultOptions = {
  isLoggedIn: false,
  count: 4,
  v2: false,
}

function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { isLoggedIn, count, v2 } = { ...defaultOptions, ...options }
  mockServer.getApi<{ count: number }>(`/v1/me/favorites/count`, { count })

  mockUseAuthContext.mockReturnValue({
    isLoggedIn,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  })

  const Component = v2 ? BicolorFavoriteCountV2 : BicolorFavoriteCount
  return render(reactQueryProviderHOC(<Component />))
}
