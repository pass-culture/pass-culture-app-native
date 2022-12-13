import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ExpiredOrLostID } from './ExpiredOrLostID'

describe('<ExpiredOrLostID/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ExpiredOrLostID />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
