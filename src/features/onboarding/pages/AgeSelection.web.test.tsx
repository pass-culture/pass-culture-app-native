import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeSelection } from './AgeSelection'

describe('<AgeSelection />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AgeSelection />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
