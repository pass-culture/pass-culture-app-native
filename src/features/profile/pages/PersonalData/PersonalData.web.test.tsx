import React from 'react'

import { UpdateEmailTokenExpiration } from 'api/gen'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { PersonalData } from './PersonalData'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

describe('<PersonalData/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApi<UpdateEmailTokenExpiration>('/v1/profile/token_expiration', {
        expiration: null,
      })
      const { container } = render(reactQueryProviderHOC(<PersonalData />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
