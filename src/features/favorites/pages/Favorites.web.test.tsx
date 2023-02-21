import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, cleanup, render, act } from 'tests/utils/web'

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
  describe('Accessibility', () => {
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })

    afterEach(() => {
      cleanup()
    })

    it('should not have basic accessibility issues when user is logged in', async () => {
      const { container } = renderFavorites({ isLoggedIn: true })

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues when user is not logged in', async () => {
      const { container } = renderFavorites({ isLoggedIn: false })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues when user is logged in but offline', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      const { container } = renderFavorites({ isLoggedIn: true })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderFavorites({ isLoggedIn }: { isLoggedIn: boolean }) {
  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({
    isLoggedIn,
    setIsLoggedIn,
    isUserLoading: false,
    refetchUser: jest.fn(),
  }))
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<Favorites />))
}
