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

jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)
jest.mock('features/favorites/context/FavoritesWrapper')
jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/network/NetInfoWrapper')

jest.useFakeTimers()

describe('<EndedBookings />', () => {
  beforeEach(() => {
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
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
