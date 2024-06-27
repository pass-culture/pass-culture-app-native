import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils/web'

import { BicolorFavoriteCount } from './BicolorFavoriteCount'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

describe('BicolorFavoriteCount component', () => {
  it('should render non connected icon', async () => {
    mockAuthContextWithoutUser()
    mockAuthContextWithoutUser()
    renderBicolorFavoriteCount({})

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeInTheDocument()
  })

  it('should render connected icon', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({})
    await waitFor(() => {
      expect(screen.getByTestId('bicolor-favorite-count')).toBeInTheDocument()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ count: 10000 })
    await waitFor(() => {
      expect(screen.getByText('99')).toBeInTheDocument()
    })
  })

  it('should show nbFavorites within badge', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({})
    await waitFor(() => {
      expect(screen.getByText(defaultOptions.count.toString())).toBeInTheDocument()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ count: 0 })
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('should not show nbFavorites within badge when offline', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockAuthContextWithUser(beneficiaryUser)
    renderBicolorFavoriteCount({ count: 10 })

    expect(screen.queryByTestId('bicolor-favorite-count')).not.toBeInTheDocument()
  })
})

interface Options {
  count?: number
}

const defaultOptions = {
  count: 4,
}

function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { count } = { ...defaultOptions, ...options }
  mockServer.getApi<{ count: number }>(`/v1/me/favorites/count`, { count })
  return render(reactQueryProviderHOC(<BicolorFavoriteCount />))
}
