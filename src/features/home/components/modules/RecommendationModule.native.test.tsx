import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { render } from 'tests/utils'

import { RecommendationModule } from './RecommendationModule'

const displayParameters: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

jest.mock('react-query')
jest.mock('features/home/api/useHomeRecommendedOffers', () => ({
  useHomeRecommendedOffers: jest.fn(() => ({
    offers: mockedAlgoliaResponse.hits,
  })),
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
    const minOffers = mockedAlgoliaResponse.hits.length + 1
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
