import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SiteMapScreen } from './SiteMapScreen'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('<SiteMapScreen />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SiteMapScreen />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
