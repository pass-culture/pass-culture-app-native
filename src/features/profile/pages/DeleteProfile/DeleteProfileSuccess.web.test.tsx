import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { DeleteProfileSuccess } from './DeleteProfileSuccess'

describe('<DeleteProfileSuccess/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileSuccess />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
