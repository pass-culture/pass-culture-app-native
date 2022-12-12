import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('features/auth/AuthContext')
jest.mock('features/auth/settings')

describe('<BeneficiaryRequestSent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BeneficiaryRequestSent />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
