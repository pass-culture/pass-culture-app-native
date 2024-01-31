import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { BookingsResponse, UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { beneficiaryUser } from 'fixtures/user'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.unmock('libs/jwt')
jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<EndedBookings />', () => {
  beforeEach(() => {
    mockServer.getApiV1<UserProfileResponse>('/me', beneficiaryUser)
    mockServer.getApiV1<BookingsResponse>('/bookings', bookingsSnap)
  })

  it('Performance test for EndedBookings page', async () => {
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
    await measurePerformance(
      reactQueryProviderHOC(
        <AuthWrapper>
          <EndedBookings />
        </AuthWrapper>
      ),
      {
        scenario: async () => {
          await screen.findByText('1 réservation terminée')
        },
      }
    )
  })
})
