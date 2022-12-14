import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { render } from 'tests/utils'

import { RecommendationModule } from './RecommendationModule'

const displayParameters: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

jest.mock('react-query')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')
jest.mock('features/home/api/useHomeRecommendedHits', () => ({
  useHomeRecommendedHits: jest.fn(() => mockedAlgoliaResponse.hits),
}))

describe('RecommendationModule', () => {
  afterEach(jest.clearAllMocks)

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
