import { rest } from 'msw'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { formattedExclusivityModule } from 'features/home/fixtures/homepage.fixture'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen, waitFor } from 'tests/utils'

import { HomeModule } from './HomeModule'

const index = 1
const homeEntryId = '7tfixfH64pd5TMZeEKfNQ'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<HomeModule />', () => {
  it('should display old exclusivity module when feature flag is false', async () => {
    server.use(
      rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/123456789`, (_req, res, ctx) =>
        res.once(ctx.status(200), ctx.json(offerResponseSnap))
      )
    )
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderHomeModule()

    // we need to use findAllByLabelText because 'Week-end FRAC' is assigned twice
    // in alt property for image and touchable link
    expect(await screen.findAllByLabelText('Week-end FRAC')).toBeTruthy()
  })

  it('should not display old exclusivity module when feature flag is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderHomeModule()

    await waitFor(() => {
      expect(screen.queryByLabelText('Week-end FRAC')).toBeNull()
    })
  })
})

function renderHomeModule() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <HomeModule item={formattedExclusivityModule} index={index} homeEntryId={homeEntryId} />
    )
  )
}
