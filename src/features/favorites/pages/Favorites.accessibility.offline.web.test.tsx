import React from 'react'

import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { Favorites } from './Favorites'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<Favorites/>', () => {
  describe('Accessibility', () => {
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
