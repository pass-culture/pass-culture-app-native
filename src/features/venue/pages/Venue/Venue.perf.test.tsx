import { SearchResponse } from '@algolia/client-search'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueResponse } from 'api/gen'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

useRoute.mockImplementation(() => ({ params: { id: venueResponseSnap.id } }))

jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValue([
  {
    title: 'Test',
    offers: {
      hits: [],
    } as unknown as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
    minNumberOfOffers: 1,
  },
])

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<Venue />', () => {
  beforeEach(() => {
    mockServer.getApiV1<VenueResponse>(`/venue/${venueResponseSnap.id}`, {
      responseOptions: { data: venueResponseSnap },
      requestOptions: { persist: true },
    })
  })

  it('Performance test for Venue page', async () => {
    await measurePerformance(reactQueryProviderHOC(<Venue />), {
      scenario: async () => {
        await act(async () => {})
      },
    })
  })
})
