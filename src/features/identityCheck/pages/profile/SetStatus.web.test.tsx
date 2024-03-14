import React from 'react'

import { ActivityTypesResponse } from 'api/gen'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SetStatus } from './SetStatus'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

describe('<SetStatus/>', () => {
  beforeEach(() => {
    mockServer.getApi<ActivityTypesResponse>('/v1/subscription/activity_types', ActivityTypesSnap)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SetStatus />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
