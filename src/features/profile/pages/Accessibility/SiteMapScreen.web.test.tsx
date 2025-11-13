import React from 'react'

import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/subcategories/useSubcategories')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockUseSearch = jest.fn(() => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
  hideSuggestions: jest.fn(),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

describe('<SiteMapScreen />', () => {
  beforeEach(() => setFeatureFlags())

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SiteMapScreen />))

      await screen.findByText('Plan du site')
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
