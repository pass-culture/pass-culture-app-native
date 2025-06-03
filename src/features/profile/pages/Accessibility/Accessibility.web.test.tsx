import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { Accessibility } from './Accessibility'

jest.mock('libs/firebase/analytics/analytics')

describe('<Accessibility/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Accessibility />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
