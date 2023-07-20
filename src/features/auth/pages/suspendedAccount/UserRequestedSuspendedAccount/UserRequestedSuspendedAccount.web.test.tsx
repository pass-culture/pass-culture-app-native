import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { UserRequestedSuspendedAccount } from './UserRequestedSuspendedAccount'

jest.mock('react-query')

describe('<UserRequestedSuspendedAccount/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<UserRequestedSuspendedAccount />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
