import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DMSIntroduction } from './DMSIntroduction'

jest.mock('libs/firebase/analytics/analytics')

describe('<DMSIntroduction/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DMSIntroduction />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
