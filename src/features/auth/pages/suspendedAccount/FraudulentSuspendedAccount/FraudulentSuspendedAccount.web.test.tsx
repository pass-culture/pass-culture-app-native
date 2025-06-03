import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { FraudulentSuspendedAccount } from './FraudulentSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

jest.mock('libs/firebase/analytics/analytics')

describe('<FraudulentSuspendedAccount/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<FraudulentSuspendedAccount />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
