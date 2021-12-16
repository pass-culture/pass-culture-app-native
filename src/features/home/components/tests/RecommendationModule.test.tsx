import React from 'react'

import { RecommendationModule } from 'features/home/components/RecommendationModule'
import { DisplayParametersFields } from 'features/home/contentful'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { render } from 'tests/utils'

const display: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

jest.mock('react-query')
jest.mock('features/home/pages/useHomeRecommendedHits', () => ({
  useHomeRecommendedHits: jest.fn(() => mockedAlgoliaResponse.hits),
}))

describe('RecommendationModule', () => {
  afterEach(jest.clearAllMocks)

  it('should trigger logEvent "RecommendationModuleSeen" when reaching the recommendation module', () => {
    render(<RecommendationModule display={display} index={1} />)

    expect(analytics.logRecommendationModuleSeen).toHaveBeenCalledWith('Tes offres recommandées', 4)
  })

  it('should not trigger logEvent "RecommendationModuleSeen" if not enough hits', () => {
    const minOffers = mockedAlgoliaResponse.hits.length + 1
    render(<RecommendationModule display={{ ...display, minOffers }} index={1} />)

    expect(analytics.logRecommendationModuleSeen).not.toHaveBeenCalled()
  })
})
