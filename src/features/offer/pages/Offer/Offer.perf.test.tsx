import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponseV2, SimilarOffersResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as GetInstalledAppsAPI from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Network } from 'libs/share/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)
jest.mock('libs/network/NetInfoWrapper')

useRoute.mockReturnValue({
  params: {
    id: offerResponseSnap.id,
  },
})

// Mock to display one messaging app button
const mockGetInstalledApps = jest.spyOn(GetInstalledAppsAPI, 'getInstalledApps') as jest.Mock
mockGetInstalledApps.mockResolvedValue([Network.snapchat])

// Performance measuring is run 10 times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 20000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<Offer />', () => {
  beforeEach(() => {
    // We mock server instead of hooks to test the real behavior of the component.
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, {
      requestOptions: { persist: true },
      responseOptions: { data: offerResponseSnap },
    })
    mockServer.getApi(`/v1/recommendation/similar_offers/${offerResponseSnap.id}`, {
      requestOptions: { persist: true },
      responseOptions: { data: mockedAlgoliaResponse.hits },
    })
    mockServer.getApi<SimilarOffersResponse>(
      `/v1/recommendation/similar_offers/${offerResponseSnap.id}`,
      {
        params: {},
        results: [],
      }
    )
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, { ...PLACEHOLDER_DATA })
  })

  it('Performance test for Offer page', async () => {
    await measurePerformance(reactQueryProviderHOC(<Offer />), {
      scenario: async () => {
        await screen.findByTestId('offerv2-container', {}, { timeout: TEST_TIMEOUT_IN_MS })
        await act(async () => {})
      },
    })
  })
})
