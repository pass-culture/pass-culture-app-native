import React from 'react'

import { PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

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

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<Favorites/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      mockUseNetInfoContext.mockReturnValue({ isConnected: true })
    })

    it('should not have basic accessibility issues when user is logged in', async () => {
      mockServer.getApi<PaginatedFavoritesResponse>(
        '/v1/me/favorites',
        paginatedFavoritesResponseSnap
      )

      const { container } = renderFavorites()

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues when user is not logged in', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      const { container } = renderFavorites()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues when user is logged in but offline', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      const { container } = renderFavorites()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderFavorites() {
  return render(reactQueryProviderHOC(<Favorites />))
}
