import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ComeBackLater } from './ComeBackLater'

describe('<ComeBackLater/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ComeBackLater />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
