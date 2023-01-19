import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccountCreated } from './AccountCreated'

describe('<AccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountCreated />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
