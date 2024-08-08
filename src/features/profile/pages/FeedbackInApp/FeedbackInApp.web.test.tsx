import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { FeedbackInApp } from './FeedbackInApp'

describe('<FeedbackInApp/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<FeedbackInApp />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
