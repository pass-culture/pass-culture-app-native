import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { AccountSecurity } from './AccountSecurity'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountSecurity />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountSecurity />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
