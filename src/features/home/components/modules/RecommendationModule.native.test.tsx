import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { RecommendationApiParams } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor, screen } from 'tests/utils'

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

jest.mock('features/home/api/useHomeRecommendedOffers', () => ({
  useHomeRecommendedOffers: jest.fn(() => ({
    offers: mockedAlgoliaResponse.hits,
    recommendationApiParams: defaultRecommendationApiParams,
  })),
}))

describe('RecommendationModule', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', async () => {
    renderRecommendationModule()

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
        1,
        'abcd',
        ContentTypes.RECOMMENDATION,
        1,
        'xyz',
        defaultRecommendationApiParams
      )
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
