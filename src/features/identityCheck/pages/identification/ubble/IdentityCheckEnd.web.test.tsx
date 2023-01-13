import React from 'react'

import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckEnd } from './IdentityCheckEnd'

jest.mock('features/auth/helpers/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockStep,
  })),
}))

describe('<IdentityCheckEnd/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckEnd />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
