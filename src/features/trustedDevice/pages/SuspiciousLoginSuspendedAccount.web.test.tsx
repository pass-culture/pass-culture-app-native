import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SuspiciousLoginSuspendedAccount } from './SuspiciousLoginSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<SuspiciousLoginSuspendedAccount/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspiciousLoginSuspendedAccount />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
