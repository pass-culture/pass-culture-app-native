import React from 'react'

import { PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Favorites } from './Favorites'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<Favorites/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render correctly', async () => {
    mockServer.getApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
    renderFavorites({ isLoggedIn: true })

    await screen.findByText('Mes favoris')

    expect(screen).toMatchSnapshot()
  })

  it('should show non connected page when not logged in', () => {
    renderFavorites({ isLoggedIn: false })

    expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderFavorites({ isLoggedIn: true })

    expect(screen.getByText('Pas de réseau internet')).toBeOnTheScreen()
  })
})

function renderFavorites({ isLoggedIn }: { isLoggedIn: boolean }) {
  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({
    isLoggedIn,
    setIsLoggedIn,
    refetchUser: jest.fn(),
    isUserLoading: false,
  }))
  return render(reactQueryProviderHOC(<Favorites />))
}
