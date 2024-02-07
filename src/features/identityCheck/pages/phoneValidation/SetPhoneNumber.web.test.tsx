import React from 'react'

import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { phoneValidationRemainingAttemptsFixture } from 'features/identityCheck/fixtures/phoneValidationRemainingAttemptsFixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SetPhoneNumber } from './SetPhoneNumber'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: jest.fn(),
    phoneValidation: { phoneNumber: undefined, country: undefined },
  }),
}))

jest.mock('ui/components/modals/useModal', () => ({
  useModal: jest.fn().mockReturnValue({
    visible: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
  }),
}))

describe('<SetPhoneNumber/>', () => {
  beforeEach(() => {
    mockServer.getApiV1<PhoneValidationRemainingAttemptsRequest>(
      '/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsFixture
    )
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SetPhoneNumber />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
