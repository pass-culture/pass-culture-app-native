import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Favorites } from './Favorites'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

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
    expect(screen.queryByText('Pas de réseau internet')).toBeOnTheScreen()
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
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<Favorites />))
}
