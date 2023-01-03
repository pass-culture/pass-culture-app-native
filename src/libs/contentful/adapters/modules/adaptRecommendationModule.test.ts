import { formattedRecommendedOffersModule } from 'features/home/fixtures/homepage.fixture'
import { adaptRecommendationModule } from 'libs/contentful/adapters/modules/adaptRecommendationModule'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { isRecommendationContentModel } from 'libs/contentful/types'

describe('adaptRecommendationModule', () => {
  it('should adapt a recommendedOffers module', () => {
    const rawRecommendationModule = recommendationNatifModuleFixture

    expect(isRecommendationContentModel(rawRecommendationModule)).toBeTruthy()
    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(
      formattedRecommendedOffersModule
    )
  })
})
