import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import {
  formattedExclusivityModule,
  formattedBusinessModule,
  formattedCategoryListModule,
  formattedRecommendedOffersModule,
  formattedThematicHighlightModule,
  formattedOffersModule,
  formattedVenuesModule,
} from 'features/home/fixtures/homepage.fixture'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { HomepageModule, ModuleData } from 'features/home/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { SimilarOffersResponse } from 'features/offer/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/geolocation'
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
const mockUseAuthContext = jest.fn().mockReturnValue({
  user: undefined,
  isLoggedIn: false,
})

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
const mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    userPosition: mockPosition,
  }),
}))

jest.mock('features/home/api/useAlgoliaRecommendedHits', () => ({
  useAlgoliaRecommendedHits: jest.fn(() => mockedAlgoliaResponse.hits),
}))

const defaultData: ModuleData = {
  playlistItems: offersFixture,
  nbPlaylistResults: 4,
  moduleId: 'blablabla',
}

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

  it('should display BusinessModule', async () => {
    renderHomeModule(formattedBusinessModule)

    expect(await screen.findByText('Débloque ton crédit\u00a0! ')).toBeTruthy()
  })

  it('should display CategoryListModule', async () => {
    renderHomeModule(formattedCategoryListModule)

    expect(await screen.findByText('Cette semaine sur le pass')).toBeTruthy()
  })

  it('should display RecommendationModule', async () => {
    const recommendedOffers: SimilarOffersResponse = {
      params: {
        call_id: 'c2b19286-a4e9-4aef-9bab-3dcbbd631f0c',
        filtered: true,
        geo_located: true,
        model_endpoint: 'default',
        model_name: 'similar_offers_default_prod',
        model_version: 'similar_offers_clicks_v2_1_prod_v_20230428T220000',
        reco_origin: 'default',
      },
      results: ['102280', '102272'],
    }

    server.use(
      rest.post(
        env.RECOMMENDATION_ENDPOINT + '/playlist_recommendation/1234',
        async (_, res, ctx) => res.once(ctx.status(200), ctx.json(recommendedOffers))
      )
    )

    renderHomeModule(formattedRecommendedOffersModule)
    await act(async () => {})

    expect(screen.getByText('Tes évènements en ligne')).toBeTruthy()
  })

  // TODO(PC-23671): Fix this VideoModule test
  it.skip('should display VideoModule', async () => {
    renderHomeModule(videoModuleFixture)

    await act(async () => {})

    expect(screen.getByText('Découvre Lujipeka')).toBeTruthy()
  })

  it('should display ThematicHighlightModule', async () => {
    mockdate.set(new Date(2024))

    renderHomeModule(formattedThematicHighlightModule)

    await act(async () => {})

    expect(screen.getByText('Temps très fort')).toBeTruthy()
  })

  it('should display OffersModule', async () => {
    renderHomeModule(formattedOffersModule, defaultData)

    await act(async () => {})
    expect(screen.getByText('La nuit des temps')).toBeTruthy()
  })

  // TODO(PC-23671): Fix this VenuesModule test
  it.skip('should display VenuesModule', async () => {
    renderHomeModule(formattedVenuesModule)

    await act(async () => {})
    expect(screen.getByText('La nuit des temps')).toBeTruthy()
  })
})

function renderHomeModule(item: HomepageModule, data?: ModuleData) {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <HomeModule item={item} index={index} homeEntryId={homeEntryId} data={data} />
    )
  )
}
