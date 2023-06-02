import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccountSecurity } from './AccountSecurity'

jest.mock('react-query')

describe('<AccountSecurity />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountSecurity />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
