import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { NotEligibleEduConnect } from './NotEligibleEduConnect'

describe('<NotEligibleEduConnect/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <NotEligibleEduConnect
          error={{ name: 'toto', message: 'toto' }}
          resetErrorBoundary={jest.fn()}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
