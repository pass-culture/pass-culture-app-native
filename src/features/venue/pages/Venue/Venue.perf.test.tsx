import { SearchResponse } from '@algolia/client-search'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Venue } from 'features/venue/pages/Venue/Venue'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('features/search/context/SearchWrapper')

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

useRoute.mockImplementation(() => ({ params: { id: venueDataTest.id } }))

jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists')
const mockUseGTLPlaylists = useGTLPlaylists as jest.Mock
mockUseGTLPlaylists.mockReturnValue({
  gtlPlaylists: [
    {
      title: 'Test',
      offers: {
        hits: [
          {
            offer: {
              name: 'Test',
              subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
            },
            venue: {
              address: 'Avenue des Tests',
              city: 'Jest',
            },
            _geoloc: {
              lat: 2,
              lng: 2,
            },
            objectID: '12',
          },
        ],
      } as SearchResponse<Offer>,
      layout: 'one-item-medium',
      entryId: '2xUlLBRfxdk6jeYyJszunX',
      minNumberOfOffers: 1,
    },
  ],
  isLoading: false,
})

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<Venue />', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueDataTest.id}`, {
      responseOptions: { data: venueDataTest },
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
