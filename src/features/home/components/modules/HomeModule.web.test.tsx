import mockdate from 'mockdate'
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
} from 'features/home/fixtures/homepage.fixture'
import { HomepageModule, ModuleData } from 'features/home/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { SimilarOffersResponse } from 'features/offer/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { HomeModule } from './HomeModule'

const index = 1
const homeEntryId = '7tfixfH64pd5TMZeEKfNQ'

const highlightOfferFixture = offersFixture[0]

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')
const mockedUseFeatureFlag = useFeatureFlag as jest.Mock

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

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
  }),
}))

jest.mock('features/home/api/useAlgoliaRecommendedOffers', () => ({
  useAlgoliaRecommendedOffers: jest.fn(() => mockedAlgoliaResponse.hits),
}))

const defaultData: ModuleData = {
  playlistItems: offersFixture,
  nbPlaylistResults: 4,
  moduleId: 'blablabla',
}

describe('<HomeModule />', () => {
  beforeEach(() => {
    mockServer.getApiV1('/subcategories/v2', {
      ...placeholderData,
    })
  })

  // Test a11y rules on each module instead of testing them on the whole page
  // because it's easier to test them one by one
  describe('Accessibility', () => {
    it('Exclusivity module should not have basic accessibility issues', async () => {
      mockServer.getApiV1<OfferResponse>(`/offer/123456789`, offerResponseSnap)

      mockedUseFeatureFlag.mockReturnValueOnce(false)
      const { container } = renderHomeModule(formattedExclusivityModule)

      // we need to use findAllByLabelText because 'Week-end FRAC' is assigned twice
      // in alt property for image and touchable link
      expect(await screen.findAllByLabelText('Week-end FRAC')).not.toHaveLength(0)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('Highlight module should not have basic accessibility issues', async () => {
      mockedUseFeatureFlag.mockReturnValueOnce(true)
      mockUseHighlightOffer.mockReturnValueOnce(highlightOfferFixture)

      const { container } = renderHomeModule(highlightOfferModuleFixture)

      await act(async () => {
        expect(screen.getByText(highlightOfferModuleFixture.highlightTitle)).toBeInTheDocument()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('Business module should not have basic accessibility issues', async () => {
      const { container } = renderHomeModule(formattedBusinessModule)

      expect(screen.getByText('Débloque ton crédit !')).toBeInTheDocument()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('CategoryList module should not have basic accessibility issues', async () => {
      const { container } = renderHomeModule(formattedCategoryListModule)

      expect(await screen.findByText('Cette semaine sur le pass')).toBeInTheDocument()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('Recommendation module should not have basic accessibility issues', async () => {
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

      mockServer.universalPost(
        env.RECOMMENDATION_ENDPOINT + '/playlist_recommendation/1234',
        recommendedOffers
      )

      const { container } = renderHomeModule(formattedRecommendedOffersModule)
      await act(async () => {})

      expect(screen.getByText('Tes évènements en ligne')).toBeInTheDocument()

      let results
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })

    it('ThematicHighlight module should not have basic accessibility issues', async () => {
      mockdate.set(new Date(2024))

      const { container } = renderHomeModule(formattedThematicHighlightModule)

      await act(async () => {})

      expect(screen.getByText('Temps très fort')).toBeInTheDocument()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('OffersModule should not have basic accessibility issues', async () => {
      const { container } = renderHomeModule(formattedOffersModule, defaultData)

      await act(async () => {})

      expect(screen.getByText('La nuit des temps')).toBeInTheDocument()

      let results
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
})

function renderHomeModule(item: HomepageModule, data?: ModuleData) {
  return render(
    reactQueryProviderHOC(
      <HomeModule item={item} index={index} homeEntryId={homeEntryId} data={data} />
    )
  )
}
