import { Hit } from '@algolia/client-search'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponseV2, SubcategoriesResponseModelv2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as GetInstalledAppsAPI from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import { Network } from 'libs/share/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer as OfferTypes } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance, screen } from 'tests/utils'

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
    mockServer.universalGet<Hit<OfferTypes>[]>(
      `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerResponseSnap.id}`,
      {
        requestOptions: { persist: true },
        responseOptions: { data: mockedAlgoliaResponse.hits },
      }
    )
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, { ...placeholderData })
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
