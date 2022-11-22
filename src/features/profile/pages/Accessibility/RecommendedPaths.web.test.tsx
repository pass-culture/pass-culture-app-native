import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { RecommendedPaths } from './RecommendedPaths'

describe('<RecommendedPaths />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<RecommendedPaths />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
