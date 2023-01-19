import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { FraudulentAccount } from './FraudulentAccount'

jest.mock('react-query')

describe('<FraudulentAccount/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<FraudulentAccount />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
