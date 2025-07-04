import mockdate from 'mockdate'
import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import {
  formattedCategoryListModule,
  formattedNewBusinessModule,
  formattedOffersModule,
  formattedRecommendedOffersModule,
  formattedThematicHighlightModule,
} from 'features/home/fixtures/homepage.fixture'
import { HomepageModule, ModuleData } from 'features/home/types'
import { SimilarOffersResponse } from 'features/offer/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeoCoordinates, Position } from 'libs/location'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { HomeModule } from './HomeModule'

const index = 1
const homeEntryId = '7tfixfH64pd5TMZeEKfNQ'

const highlightOfferFixture = offersFixture[0]

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
    geolocPosition: mockPosition,
    userLocation: mockPosition,
  }),
}))

jest.mock('queries/offer/useAlgoliaSimilarOffersQuery', () => ({
  useAlgoliaSimilarOffersQuery: jest.fn(() => mockedAlgoliaResponse.hits),
}))

const defaultData: ModuleData = {
  playlistItems: offersFixture,
  nbPlaylistResults: 4,
  moduleId: 'blablabla',
}

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<HomeModule />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  // Test a11y rules on each module instead of testing them on the whole page
  // because it's easier to test them one by one
  describe('Accessibility', () => {
    it('Business module should not have basic accessibility issues', async () => {
      const { container } = await renderHomeModule(formattedNewBusinessModule)

      expect(screen.getByText('Rencontre d’arles participe à notre concours')).toBeInTheDocument()

      let results
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })

    it('Highlight module should not have basic accessibility issues', async () => {
      mockUseHighlightOffer.mockReturnValueOnce(highlightOfferFixture)

      const { container } = await renderHomeModule(highlightOfferModuleFixture)

      await act(async () => {
        expect(screen.getByText('L’offre du moment')).toBeInTheDocument()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('CategoryList module should not have basic accessibility issues', async () => {
      const { container } = await renderHomeModule(formattedCategoryListModule)

      expect(await screen.findByText('Cette semaine sur le pass')).toBeInTheDocument()

      let results
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })
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

    mockServer.postApi('/v1/recommendation/playlist', recommendedOffers)

    const { container } = await renderHomeModule(formattedRecommendedOffersModule)
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

    const { container } = await renderHomeModule(formattedThematicHighlightModule)

    await act(async () => {})

    expect(screen.getByText('Temps très fort')).toBeInTheDocument()

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('OffersModule should not have basic accessibility issues', async () => {
    const { container } = await renderHomeModule(formattedOffersModule, defaultData)

    await act(async () => {})

    expect(screen.getAllByText('I want something more')[0]).toBeInTheDocument()

    let results
    await act(async () => {
      results = await checkAccessibilityFor(container)
    })

    expect(results).toHaveNoViolations()
  })
})

const renderHomeModule = async (item: HomepageModule, data?: ModuleData) =>
  act(async () => {
    return render(
      reactQueryProviderHOC(
        <HomeModule item={item} index={index} homeEntryId={homeEntryId} data={data} />
      ),
      { theme: { isDesktopViewport: true } }
    )
  })
