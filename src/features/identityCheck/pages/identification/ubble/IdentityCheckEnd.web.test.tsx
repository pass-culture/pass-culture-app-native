import React from 'react'

import { SubscriptionStepperResponseV2 } from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<IdentityCheckEnd/>', () => {
  describe('Accessibility', () => {
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      subscriptionStepperFixture
    )

    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<IdentityCheckEnd />))

      await act(async () => {})
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
