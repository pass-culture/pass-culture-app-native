import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccountReactivationSuccess } from './AccountReactivationSuccess'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountReactivationSuccess/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountReactivationSuccess />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
