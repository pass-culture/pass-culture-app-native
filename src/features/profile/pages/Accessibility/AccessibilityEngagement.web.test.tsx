import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccessibilityEngagement } from './AccessibilityEngagement'

describe('<AccessibilityEngagement/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityEngagement />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
