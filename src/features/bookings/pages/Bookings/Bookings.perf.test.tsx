import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import {
  BookingsResponse,
  GetAvailableReactionsResponse,
  SubcategoriesResponseModelv2,
  UserProfileResponse,
} from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { bookingsSnap } from 'features/bookings/fixtures'
import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/src/private/animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

jest.mock('libs/network/NetInfoWrapper')
jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
jest.useFakeTimers()

describe('<Bookings />', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi<GetAvailableReactionsResponse>(
      '/v1/reaction/available',
      availableReactionsSnap
    )
  })

  it('Performance test for Bookings page', async () => {
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
    await measurePerformance(
      reactQueryProviderHOC(
        <AuthWrapper>
          <Bookings />
        </AuthWrapper>
      ),
      {
        scenario: async () => {
          await screen.findByText('Mes réservations', {}, { timeout: TEST_TIMEOUT_IN_MS })
        },
      }
    )
  })
})
