import mockdate from 'mockdate'
import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { useVideoOffers } from 'features/home/api/useVideoOffers'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import {
  formattedBusinessModule,
  formattedCategoryListModule,
  formattedExclusivityModule,
  formattedOffersModule,
  formattedRecommendedOffersModule,
  formattedThematicHighlightModule,
  formattedTrendsModule,
  formattedVenuesModule,
} from 'features/home/fixtures/homepage.fixture'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { HomepageModule, HomepageModuleType, ModuleData } from 'features/home/types'
import { SimilarOffersResponse } from 'features/offer/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils'

import { HomeModule } from './HomeModule'

const featureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

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

const mockUseLocation = jest.fn(() => ({
  geolocPosition: mockPosition,
  userLocation: mockPosition,
  onModalHideRef: jest.fn(),
}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('features/home/api/useAlgoliaRecommendedOffers', () => ({
  useAlgoliaRecommendedOffers: jest.fn(() => mockedAlgoliaResponse.hits),
}))

jest.mock('features/home/api/useVideoOffers')
const mockUseVideoOffers = useVideoOffers as jest.Mock

const offerFixture = [
  {
    offer: {
      thumbUrl: 'http://thumbnail',
      subcategoryId: 'CONCERT',
    },
    objectID: 12345,
    venue: {
      id: 5678,
    },
  },
  {
    offer: {
      thumbUrl: 'http://thumbnail',
      subcategoryId: 'CONFERENCE',
    },
    objectID: 67890,
    venue: {
      id: 5432,
    },
  },
]

const defaultData: ModuleData = {
  playlistItems: offersFixture,
  nbPlaylistResults: 4,
  moduleId: 'blablabla',
}

const defaultDataVenues: ModuleData = {
  playlistItems: venuesSearchFixture.hits,
  nbPlaylistResults: 4,
  moduleId: 'blablabla',
}

jest.mock('libs/firebase/analytics/analytics')

describe('<HomeModule />', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', {
      ...PLACEHOLDER_DATA,
    })
  })

  it('should display highlightOfferModule', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(highlightOfferFixture)

    renderHomeModule(highlightOfferModuleFixture)

    await act(async () => {
      expect(screen.getByText(highlightOfferModuleFixture.highlightTitle)).toBeOnTheScreen()
    })
  })

  it('should not display old ExclusivityOfferModule', async () => {
    renderHomeModule(formattedExclusivityModule)

    await waitFor(() => {
      expect(screen.queryByLabelText('Week-end FRAC')).not.toBeOnTheScreen()
    })
  })

  it('should display BusinessModule', async () => {
    renderHomeModule(formattedBusinessModule)

    expect(await screen.findByText('Débloque ton crédit\u00a0! ')).toBeOnTheScreen()
  })

  it('should display CategoryListModule', async () => {
    renderHomeModule(formattedCategoryListModule)

    expect(await screen.findByText('Cette semaine sur le pass')).toBeOnTheScreen()
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

    mockServer.postApi('/v1/recommendation/playlist', recommendedOffers)

    renderHomeModule(formattedRecommendedOffersModule)
    await waitFor(() => {
      expect(screen.getByText('Tes évènements en ligne')).toBeOnTheScreen()
    })
  })

  it('should display VideoModule', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture[0]] })
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture[1]] })

    renderHomeModule(videoModuleFixture)

    await screen.findByText('Découvre Lujipeka')

    expect(screen.getByTestId('mobile-video-module')).toBeOnTheScreen()
  })

  it('should display ThematicHighlightModule', async () => {
    mockdate.set(new Date(2024))

    renderHomeModule(formattedThematicHighlightModule)

    await waitFor(() => {
      expect(screen.getByText('Temps très fort')).toBeOnTheScreen()
    })
  })

  it('should display OffersModule', async () => {
    renderHomeModule(formattedOffersModule, defaultData)

    await waitFor(() => {
      expect(screen.getByText('La nuit des temps')).toBeOnTheScreen()
    })
  })

  it('should display VenuesModule', async () => {
    renderHomeModule(formattedVenuesModule, defaultDataVenues)

    await waitFor(() => {
      expect(screen.getByText('Le Petit Rintintin 1')).toBeOnTheScreen()
    })
  })

  it('should display AppV2VenuesModule', async () => {
    featureFlagSpy.mockReturnValueOnce(true)
    renderHomeModule(
      {
        ...formattedVenuesModule,
        type: HomepageModuleType.AppV2VenuesModule,
        homeVenuesListEntryId: homeEntryId,
      },
      defaultDataVenues
    )

    await waitFor(() => {
      expect(screen.getByText('Le Petit Rintintin 1')).toBeOnTheScreen()
    })
  })

  it('should not display trends module when FF is disabled', async () => {
    renderHomeModule(formattedTrendsModule)

    expect(screen.queryByText('Tendance 1')).not.toBeOnTheScreen()
  })

  it('should display trends module when FF is enabled', async () => {
    featureFlagSpy.mockReturnValueOnce(true)
    renderHomeModule(formattedTrendsModule)

    expect(await screen.findByText('Tendance 1')).toBeOnTheScreen()
  })
})

function renderHomeModule(item: HomepageModule, data?: ModuleData) {
  return render(
    reactQueryProviderHOC(
      <HomeModule item={item} index={index} homeEntryId={homeEntryId} data={data} />
    )
  )
}
