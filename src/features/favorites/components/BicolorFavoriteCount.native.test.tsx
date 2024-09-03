import React from 'react'

import { BicolorFavoriteCountV2 } from 'features/favorites/components/BicolorFavoriteCountV2'
import { beneficiaryUser } from 'fixtures/user'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe.each`
  v2       | component
  ${false} | ${'BicolorFavoriteCount'}
  ${true}  | ${'BicolorFavoriteCountV2'}
`('$component component', ({ v2 }) => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  const componentTestId = `bicolor-favorite-count${v2 ? '-v2' : ''}`

  it('should render non connected icon', async () => {
    mockAuthContextWithoutUser()
    renderBicolorFavoriteCount({ v2 })

    await waitFor(() => {
      expect(screen.queryByTestId(componentTestId)).not.toBeOnTheScreen()
    })
  })

  it('should render connected icon', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ v2 })

    await waitFor(() => {
      expect(screen.getByTestId(componentTestId)).toBeOnTheScreen()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ v2, count: 10000 })

    await waitFor(() => {
      expect(screen.getByText('99+')).toBeOnTheScreen()
    })
  })

  it('should show nbFavorites within badge', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ v2 })

    await waitFor(() => {
      expect(screen.getByText(defaultOptions.count.toString())).toBeOnTheScreen()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ v2, count: 0 })
    await waitFor(() => {
      expect(screen.getByText('0')).toBeOnTheScreen()
    })
  })

  it('should not show nbFavorites within badge when offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ v2, count: 10 })
    await act(async () => {})

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeOnTheScreen()
  })
})

interface Options {
  v2: boolean
  count?: number
}

const defaultOptions = {
  count: 4,
  v2: false,
}

function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { count, v2 } = { ...defaultOptions, ...options }
  mockServer.getApi<{ count: number }>(`/v1/me/favorites/count`, { count })

  const Component = v2 ? BicolorFavoriteCountV2 : BicolorFavoriteCount
  return render(reactQueryProviderHOC(<Component />))
}
