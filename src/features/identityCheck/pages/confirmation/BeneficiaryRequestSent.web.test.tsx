import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('features/auth/AuthContext')

describe('<BeneficiaryRequestSent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BeneficiaryRequestSent />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
