import React from 'react'

import { UpdateEmailTokenExpiration } from 'api/gen'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { PersonalData } from './PersonalData'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
