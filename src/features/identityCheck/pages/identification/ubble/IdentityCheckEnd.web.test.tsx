import React from 'react'

import { subscriptionStepperFixture as mockStep } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckEnd } from './IdentityCheckEnd'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    identification: {
      done: true,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '02/02/2006',
      method: 'ubble',
    },
  }),
}))

jest.mock('features/identityCheck/fixtures/subscriptionStepperFixture.ts', () => ({
  subscriptionStepperFixture: jest.fn(() => ({
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
