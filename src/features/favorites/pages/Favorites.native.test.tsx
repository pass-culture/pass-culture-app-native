import React from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { cleanup, render } from 'tests/utils'

import { Favorites } from './Favorites'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<Favorites/>', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(async () => {
    await cleanup()
  })

  it('should render correctly', () => {
    const { toJSON } = renderFavorites({ isLoggedIn: true })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show non connected page when not logged in', () => {
    const { getByText } = renderFavorites({ isLoggedIn: false })
    expect(getByText('Identifie-toi pour retrouver tes favoris')).toBeTruthy()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const renderAPI = renderFavorites({ isLoggedIn: true })
    expect(renderAPI.queryByText('Pas de réseau internet')).toBeTruthy()
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
