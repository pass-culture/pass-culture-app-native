import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { CodeNotReceivedModal } from './CodeNotReceivedModal'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    phoneValidation: {
      phoneNumber: '0612345678',
      country: { callingCodes: ['33'], countryCode: 'FR' },
    },
  }),
}))

describe('<CodeNotReceivedModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} />)
      )
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
