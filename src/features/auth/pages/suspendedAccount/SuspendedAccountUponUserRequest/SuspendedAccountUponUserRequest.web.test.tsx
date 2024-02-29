import React from 'react'

import { UserSuspensionDateResponse } from 'api/gen'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

describe('<SuspendedAccountUponUserRequest/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApiV1<UserSuspensionDateResponse>('/account/suspension_date', {
        date: '2022-05-02',
      })
      const { container } = render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

      await screen.findByText('Tu as jusqu’au 1 juillet 2022 à 00h00 pour réactiver ton compte.')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
