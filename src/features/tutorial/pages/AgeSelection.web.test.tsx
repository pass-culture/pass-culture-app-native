import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeSelection } from './AgeSelection'

describe('<AgeSelection/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for onboarding tutorial', async () => {
      const { container } = render(<AgeSelection type="onboarding" />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for profile tutorial', async () => {
      const { container } = render(<AgeSelection type="profileTutorial" />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
