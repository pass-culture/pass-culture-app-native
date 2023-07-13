import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, act } from 'tests/utils'

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

/* TODO(PC-21140): Remove this mock when update to Jest 28
  In jest version 28, I don't bring that error :
  TypeError: requestAnimationFrame is not a function */
jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

describe('<Favorites/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should render correctly', async () => {
    renderFavorites({ isLoggedIn: true })
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should show non connected page when not logged in', () => {
    renderFavorites({ isLoggedIn: false })
    expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeTruthy()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderFavorites({ isLoggedIn: true })
    expect(screen.queryByText('Pas de réseau internet')).toBeTruthy()
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
