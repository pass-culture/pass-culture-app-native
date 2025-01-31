import React from 'react'

import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { phoneValidationRemainingAttemptsFixture } from 'features/identityCheck/fixtures/phoneValidationRemainingAttemptsFixture'
import { mockServer } from 'tests/mswServer'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { PhoneValidationTooManySMSSent } from './PhoneValidationTooManySMSSent'

describe('<PhoneValidationTooManySMSSent/>', () => {
  beforeEach(() => {
    mockServer.getApi<PhoneValidationRemainingAttemptsRequest>(
      '/v1/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsFixture
    )
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<PhoneValidationTooManySMSSent />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
