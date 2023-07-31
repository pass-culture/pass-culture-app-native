import { rest } from 'msw'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, screen, measurePerformance } from 'tests/utils'

import { Home } from './Home'

jest.mock('libs/geolocation')

const offerResponse: OfferResponse = { ...offerResponseSnap, id: 317 }
server.use(
  rest.get<OfferResponse>(
    `${env.API_BASE_URL}/native/v1/offer/${offerResponse.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(offerResponse))
  )
)

// Performance measuring is run 10 times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 20_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
describe('<Home />', () => {
  useRoute.mockReturnValue({ params: undefined })

  it('Performance test for loading Home page', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    await measurePerformance(reactQueryProviderHOC(<Home />), {
      scenario: async () => {
        await screen.findByText('Consulte notre FAQ !', {}, { timeout: TEST_TIMEOUT_IN_MS })
        await act(() => {})
      },
    })
  })
})
