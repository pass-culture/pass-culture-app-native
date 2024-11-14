import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { BookingsResponse, SubcategoriesResponseModelv2, UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { beneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)
jest.mock('features/favorites/context/FavoritesWrapper')
jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/network/NetInfoWrapper')
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.useFakeTimers()

describe('<EndedBookings />', () => {
  beforeEach(() => {
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
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
          await screen.findByText('2 réservations terminées')
        },
      }
    )
  })
})
