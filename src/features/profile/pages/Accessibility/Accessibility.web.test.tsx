import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { Accessibility } from './Accessibility'

describe('<Accessibility/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Accessibility />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
