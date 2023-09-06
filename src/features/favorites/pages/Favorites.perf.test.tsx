import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { Favorites } from 'features/favorites/pages/Favorites'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
jest.useFakeTimers({ legacyFakeTimers: true })

const offerIds = paginatedFavoritesResponseSnap.favorites.map((favorite) => favorite.offer.id)

offerIds.map((offerId) => {
  simulateBackend({
    id: offerId,
    hasAddFavoriteError: false,
    hasRemoveFavoriteError: false,
  })
})

jest.unmock('libs/jwt')
jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

describe('<Favorites />', () => {
  it('Performance test for Favorites page', async () => {
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
    await measurePerformance(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
