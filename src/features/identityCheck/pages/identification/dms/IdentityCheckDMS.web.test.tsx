import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckDMS } from './IdentityCheckDMS'

describe('<IdentityCheckDMS/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckDMS />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
