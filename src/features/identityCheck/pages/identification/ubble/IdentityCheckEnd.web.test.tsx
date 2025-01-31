import React from 'react'

import { SubscriptionStepperResponseV2 } from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { mockServer } from 'tests/mswServer'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

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

describe('<IdentityCheckEnd/>', () => {
  describe('Accessibility', () => {
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      subscriptionStepperFixture
    )

    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckEnd />)

      await act(async () => {})
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
