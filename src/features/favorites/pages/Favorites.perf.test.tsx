import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { UserProfileResponse } from 'api/gen'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { Favorites } from 'features/favorites/pages/Favorites'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
jest.useFakeTimers()

const offerIds = paginatedFavoritesResponseSnap.favorites.map((favorite) => favorite.offer.id)

offerIds.forEach((offerId) => {
  simulateBackend({
    id: offerId,
    hasAddFavoriteError: false,
    hasRemoveFavoriteError: false,
  })
})

jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)
jest.mock('libs/network/NetInfoWrapper')

describe('<Favorites />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
  })

  it('Performance test for Favorites page', async () => {
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
    await measurePerformance(
      reactQueryProviderHOC(
        <AuthWrapper>
          <Favorites />
        </AuthWrapper>
      ),
      {
        scenario: async () => {
          await screen.findByText(`4 favoris`, {}, { timeout: TEST_TIMEOUT_IN_MS })
        },
      }
    )
  })
})
