import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { ActivityTypesResponse } from 'api/gen'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SetStatus } from './SetStatus'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetStatus/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<ActivityTypesResponse>('/v1/subscription/activity_types', ActivityTypesSnap)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetStatus()

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

const renderSetStatus = () => {
  return render(reactQueryProviderHOC(<SetStatus />))
}
