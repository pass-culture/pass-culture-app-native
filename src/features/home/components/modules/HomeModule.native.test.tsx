import { rest } from 'msw'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { formattedExclusivityModule } from 'features/home/fixtures/homepage.fixture'
import { HomepageModule } from 'features/home/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { offersFixture } from 'shared/offer/offer.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, render, screen, waitFor } from 'tests/utils'

import { HomeModule } from './HomeModule'

const index = 1
const homeEntryId = '7tfixfH64pd5TMZeEKfNQ'

const highlightOfferFixture = offersFixture[0]

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

jest.mock('features/home/api/useHighlightOffer')
const mockUseHighlightOffer = useHighlightOffer as jest.Mock

describe('<HomeModule />', () => {
  it('should display old exclusivity module when feature flag is false', async () => {
    server.use(
      rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/123456789`, (_req, res, ctx) =>
        res.once(ctx.status(200), ctx.json(offerResponseSnap))
      )
    )
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderHomeModule(formattedExclusivityModule)

    // we need to use findAllByLabelText because 'Week-end FRAC' is assigned twice
    // in alt property for image and touchable link
    expect(await screen.findAllByLabelText('Week-end FRAC')).toBeTruthy()
  })

  it('should not display old exclusivity module when feature flag is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderHomeModule(formattedExclusivityModule)

    await waitFor(() => {
      expect(screen.queryByLabelText('Week-end FRAC')).toBeNull()
    })
  })

  it('should show highlight module when feature flag is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    mockUseHighlightOffer.mockReturnValueOnce(highlightOfferFixture)

    renderHomeModule(highlightOfferModuleFixture)

    await act(async () => {
      expect(screen.getByText(highlightOfferModuleFixture.highlightTitle)).toBeTruthy()
    })
  })

  it('should not show highlight module when feature flag is false', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    mockUseHighlightOffer.mockReturnValueOnce(highlightOfferFixture)

    renderHomeModule(highlightOfferModuleFixture)

    await waitFor(() => {
      expect(screen.queryByText(highlightOfferModuleFixture.highlightTitle)).toBeNull()
    })
  })
})

function renderHomeModule(item: HomepageModule) {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<HomeModule item={item} index={index} homeEntryId={homeEntryId} />)
  )
}
