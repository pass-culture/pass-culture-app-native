import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ForceUpdate } from './ForceUpdate'

describe('<ForceUpdate/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ForceUpdate resetErrorBoundary={() => null} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
