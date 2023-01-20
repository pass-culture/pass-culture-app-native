import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { VerifyEligibility } from './VerifyEligibility'

jest.mock('react-query')

describe('<VerifyEligibility/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<VerifyEligibility />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
