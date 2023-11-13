import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { Profile } from 'features/profile/pages/Profile'
import { beneficiaryUser } from 'fixtures/user'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

// We mock server instead of hooks to test the real behavior of the component.
mockServer.getApiV1<UserProfileResponse>('/me', beneficiaryUser)

jest.unmock('libs/jwt')
jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
jest.useFakeTimers({ legacyFakeTimers: true })

describe('<Profile />', () => {
  it('Performance test for Profile page', async () => {
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
