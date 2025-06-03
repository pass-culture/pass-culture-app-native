import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { Maintenance } from './Maintenance'

jest.mock('libs/firebase/analytics/analytics')

describe('<Maintenance/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Maintenance />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
