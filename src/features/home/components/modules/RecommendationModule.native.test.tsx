import React from 'react'

import { mockedAlgoliaHitsResponse } from 'libs/algolia/__mocks__/mockedAlgoliaHitResponse'
import { analytics } from 'libs/analytics'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful'
import { render } from 'tests/utils'

import { RecommendationModule } from './RecommendationModule'

const displayParameters: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

jest.mock('react-query')
jest.mock('features/home/api/useHomeRecommendedHits', () => ({
  useHomeRecommendedHits: jest.fn(() => mockedAlgoliaHitsResponse.hits),
}))

describe('RecommendationModule', () => {
  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    render(
      <RecommendationModule
        displayParameters={displayParameters}
        index={1}
        moduleId={'abcd'}
        homeEntryId={'xyz'}
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      'abcd',
      ContentTypes.RECOMMENDATION,
      1,
      'xyz'
    )
  })

  it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    const minOffers = mockedAlgoliaHitsResponse.hits.length + 1
    render(
      <RecommendationModule
        displayParameters={{ ...displayParameters, minOffers }}
        index={1}
        moduleId={'abcd'}
        homeEntryId={'xyz'}
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })
})
