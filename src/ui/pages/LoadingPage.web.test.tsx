import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { LoadingPage } from './LoadingPage'

describe('<LoadingPage />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<LoadingPage />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
