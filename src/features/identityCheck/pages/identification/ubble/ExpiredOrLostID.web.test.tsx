import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ExpiredOrLostID } from './ExpiredOrLostID'

jest.mock('libs/firebase/analytics/analytics')

describe('<ExpiredOrLostID/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ExpiredOrLostID />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
