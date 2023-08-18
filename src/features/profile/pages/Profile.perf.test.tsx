import { rest } from 'msw'
import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { Profile } from 'features/profile/pages/Profile'
import { beneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, measurePerformance } from 'tests/utils'

// We mock server instead of hooks to test the real behavior of the component.
server.use(
  rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(beneficiaryUser))
  )
)

const tokenRemainingLifetimeInMs = 10 * 60 * 1000
const decodedTokenWithRemainingLifetime = {
  exp: (new Date().getTime() + tokenRemainingLifetimeInMs) / 1000,
  iat: 1691670780,
  jti: '7f82c8b0-6222-42be-b913-cdf53958f17d',
  sub: 'bene_18@example.com',
  nbf: 1691670780,
  user_claims: { user_id: 1234 },
}
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
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
