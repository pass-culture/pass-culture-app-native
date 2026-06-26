import React from 'react'

import { UserSuspensionDateResponse } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

mockAuthContextWithUser({
  ...beneficiaryUser,
})

describe('<SuspendedAccountUponUserRequest/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', {
        date: '2022-05-02',
      })
      const { container } = render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

      await screen.findByText('Tu as jusqu’au 1er juillet 2022 à 00h00 pour réactiver ton compte.')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
