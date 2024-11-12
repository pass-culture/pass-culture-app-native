import React from 'react'

import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { phoneValidationRemainingAttemptsFixture } from 'features/identityCheck/fixtures/phoneValidationRemainingAttemptsFixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { CodeNotReceivedModal } from './CodeNotReceivedModal'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    phoneValidation: {
      phoneNumber: '0612345678',
      country: { callingCode: '33', countryCode: 'FR' },
    },
  }),
}))

describe('<CodeNotReceivedModal/>', () => {
  beforeEach(() => {
    mockServer.getApi<PhoneValidationRemainingAttemptsRequest>(
      '/v1/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsFixture
    )
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} />)
      )

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
