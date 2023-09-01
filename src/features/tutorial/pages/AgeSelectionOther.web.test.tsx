import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeSelectionOther } from './AgeSelectionOther'

describe('<AgeSelectionOther/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AgeSelectionOther />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
