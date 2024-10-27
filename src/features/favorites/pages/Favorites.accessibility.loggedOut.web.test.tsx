import React from 'react'

import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { Favorites } from './Favorites'

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<Favorites/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues when user is not logged in', async () => {
      mockAuthContextWithoutUser()

      const { container } = renderFavorites()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderFavorites() {
  return render(reactQueryProviderHOC(<Favorites />))
}
