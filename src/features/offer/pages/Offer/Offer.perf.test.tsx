import { rest } from 'msw'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { measurePerformance, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

useRoute.mockReturnValue({
  params: {
    id: offerResponseSnap.id,
  },
})

// We mock server instead of hooks to test the real behavior of the component.
server.use(
  rest.get(
    `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerResponseSnap.id}`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(mockedAlgoliaResponse.hits))
  )
)

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock
mockCheckInstalledApps.mockResolvedValue({
  [Network.snapchat]: true,
})

describe('<Offer />', () => {
  it('Performance test', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    await measurePerformance(reactQueryProviderHOC(<Offer />), {
      scenario: async () => {
        await screen.findByTestId('offer-container')
      },
    })
  })
})
