import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

jest.mock('react-query')

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('<ConfirmDeleteProfile/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ConfirmDeleteProfile />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
