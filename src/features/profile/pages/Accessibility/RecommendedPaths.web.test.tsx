import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { RecommendedPaths } from './RecommendedPaths'

jest.mock('libs/firebase/analytics/analytics')

describe('<RecommendedPaths />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<RecommendedPaths />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
