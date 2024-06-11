import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccessibilityEngagement } from './AccessibilityEngagement'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccessibilityEngagement/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityEngagement />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
