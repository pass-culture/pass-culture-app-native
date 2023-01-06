import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PageNotFound } from './PageNotFound'

describe('<PageNotFound/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<PageNotFound />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
