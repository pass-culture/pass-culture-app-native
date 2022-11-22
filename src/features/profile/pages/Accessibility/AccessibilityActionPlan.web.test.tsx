import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccessibilityActionPlan } from './AccessibilityActionPlan'

describe('<AccessibilityActionPlan/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityActionPlan />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
