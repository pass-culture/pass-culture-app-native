import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckUnavailable } from './IdentityCheckUnavailable'

describe('<IdentityCheckUnavailable/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckUnavailable />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
