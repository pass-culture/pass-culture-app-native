import React from 'react'

import { RecommendationApiParams, SubcategoriesResponseModelv2 } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { RecommendationModule } from './RecommendationModule'

const displayParameters: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

const defaultRecommendationApiParams: RecommendationApiParams = {
  call_id: '1',
  reco_origin: 'unknown',
}

const mockUseHomeRecommendedOffers = jest.fn().mockReturnValue({
  offers: mockedAlgoliaResponse.hits,
  recommendationApiParams: defaultRecommendationApiParams,
})

jest.mock('features/home/api/useHomeRecommendedOffers', () => ({
  useHomeRecommendedOffers: () => mockUseHomeRecommendedOffers(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('RecommendationModule', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', async () => {
    setFeatureFlags()
    renderRecommendationModule()

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: '1',
        moduleId: 'abcd',
        moduleType: ContentTypes.RECOMMENDATION,
        index: 1,
        homeEntryId: 'xyz',
        offers: ['102280', '102272', '102249', '102310'],
      })
    })
  })

  it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', async () => {
    const minOffers = mockedAlgoliaResponse.hits.length + 1
    renderRecommendationModule({ ...displayParameters, minOffers })

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should not display RecommendationModule if no offer', async () => {
    mockUseHomeRecommendedOffers.mockReturnValueOnce({
      offers: [],
      recommendationApiParams: defaultRecommendationApiParams,
    })
    renderRecommendationModule()

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })
  })
})

const renderRecommendationModule = (additionalDisplayParams?: DisplayParametersFields) =>
  render(
    reactQueryProviderHOC(
      <RecommendationModule
        index={1}
        moduleId="abcd"
        homeEntryId="xyz"
        displayParameters={additionalDisplayParams || displayParameters}
      />
    )
  )
