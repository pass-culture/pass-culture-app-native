import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as GetInstalledAppsAPI from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

useRoute.mockReturnValue({
  params: {
    id: offerResponseSnap.id,
  },
})

// We mock server instead of hooks to test the real behavior of the component.
mockServer.universalGet(
  `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerResponseSnap.id}`,
  mockedAlgoliaResponse.hits
)

// Mock to display one messaging app button
const mockGetInstalledApps = jest.spyOn(GetInstalledAppsAPI, 'getInstalledApps') as jest.Mock
mockGetInstalledApps.mockResolvedValue([Network.snapchat])

// Performance measuring is run 10 times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 20000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<Offer />', () => {
  it('Performance test for Offer page', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    await measurePerformance(reactQueryProviderHOC(<Offer />), {
      scenario: async () => {
        await screen.findByTestId('offer-container', {}, { timeout: TEST_TIMEOUT_IN_MS })
        await act(async () => {})
      },
    })
  })
})
