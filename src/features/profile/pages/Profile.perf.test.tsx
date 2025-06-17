import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { Profile } from 'features/profile/pages/Profile'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/src/private/animated/NativeAnimatedHelper')

// We mock server instead of hooks to test the real behavior of the component.
mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)

jest.mock('features/favorites/context/FavoritesWrapper')

jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
jest.useFakeTimers()

describe('<Profile />', () => {
  it('Performance test for Profile page', async () => {
    setFeatureFlags()
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
    await measurePerformance(
      reactQueryProviderHOC(
        <AuthWrapper>
          <Profile />
        </AuthWrapper>
      ),
      {
        // Add scenario if necessary
        scenario: async () => {
          await act(async () => {})
        },
      }
    )
  })
})
