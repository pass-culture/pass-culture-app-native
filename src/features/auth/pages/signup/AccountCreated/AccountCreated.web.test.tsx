import React from 'react'

import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { AccountCreated } from './AccountCreated'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountCreated />)

      await screen.findByLabelText('On y va !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
