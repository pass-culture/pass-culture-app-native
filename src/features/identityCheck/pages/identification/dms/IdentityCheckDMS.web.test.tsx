import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { IdentityCheckDMS } from './IdentityCheckDMS'

jest.mock('libs/firebase/analytics/analytics')

describe('<IdentityCheckDMS/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckDMS />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
