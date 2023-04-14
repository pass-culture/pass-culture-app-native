import React from 'react'

import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { render, checkAccessibilityFor } from 'tests/utils/web'

describe('SelectIDStatus', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SelectIDStatus />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
