import React from 'react'

import { ActivityTypesResponse } from 'api/gen'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<ChangeStatus/>', () => {
  beforeEach(() => {
    mockServer.getApi<ActivityTypesResponse>('/v1/subscription/activity_types', ActivityTypesSnap)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ChangeStatus />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
