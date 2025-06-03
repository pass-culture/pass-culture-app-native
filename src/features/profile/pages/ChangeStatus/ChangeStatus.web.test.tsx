import React from 'react'

import { ActivityTypesResponse } from 'api/gen'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('libs/firebase/analytics/analytics')

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
