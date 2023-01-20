import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspendedAccount } from './SuspendedAccount'

jest.mock('react-query')

describe('<SuspendedAccount/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspendedAccount />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
