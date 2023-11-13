import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SetPhoneNumber } from './SetPhoneNumber'

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
