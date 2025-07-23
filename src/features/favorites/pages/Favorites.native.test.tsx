import React from 'react'

import { PaginatedFavoritesResponse } from 'api/gen'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { beneficiaryUser } from 'fixtures/user'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Favorites } from './Favorites'

jest.mock('libs/subcategories/useSubcategories')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
jest.mock('libs/jwt/jwt')

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<Favorites/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  //TODO(PC-36585): unskip this test
  it.skip('should render correctly', async () => {
    mockServer.getApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
    mockAuthContextWithUser(beneficiaryUser)
    render(reactQueryProviderHOC(<Favorites />))

    await screen.findByText('Mes favoris')

    expect(screen).toMatchSnapshot()
  })

  it('should show non connected page when not logged in', async () => {
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<Favorites />))

    expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
  })

  it('should render offline page when not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    mockAuthContextWithUser(beneficiaryUser)
    render(reactQueryProviderHOC(<Favorites />))

    expect(await screen.findByText('Pas de réseau internet')).toBeOnTheScreen()
  })
})
