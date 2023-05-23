import React from 'react'

import { AuthWrapper } from 'features/auth/context/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { Favorites } from 'features/favorites/pages/Favorites'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

const offerIds = paginatedFavoritesResponseSnap.favorites.map((favorite) => favorite.offer.id)

offerIds.map((offerId) => {
  simulateBackend({
    id: offerId,
    hasAddFavoriteError: false,
    hasRemoveFavoriteError: false,
  })
})

describe('<Favorites />', () => {
  it('Performance test for Favorites page', async () => {
    storage.saveString('access_token', 'token')
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
