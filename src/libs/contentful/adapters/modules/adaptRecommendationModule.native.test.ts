import { formattedRecommendedOffersModule } from 'features/home/fixtures/homepage.fixture'
import { adaptRecommendationModule } from 'libs/contentful/adapters/modules/adaptRecommendationModule'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { RecommendationFields, isRecommendationContentModel } from 'libs/contentful/types'

describe('adaptRecommendationModule', () => {
  it('should adapt a recommendedOffers module', () => {
    const rawRecommendationModule = recommendationNatifModuleFixture

    expect(isRecommendationContentModel(rawRecommendationModule)).toBe(true)
    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(
      formattedRecommendedOffersModule
    )
  })

  it('should return null when the module is not published', () => {
    const rawRecommendationModule = { ...recommendationNatifModuleFixture, fields: undefined }

    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(null)
  })

  it('should return null when the Display Parameters module is not published', () => {
    const rawRecommendationModule = {
      ...recommendationNatifModuleFixture,
      fields: {
        ...(recommendationNatifModuleFixture.fields as RecommendationFields),
        displayParameters: {
          ...(recommendationNatifModuleFixture.fields as RecommendationFields).displayParameters,
          fields: undefined,
        },
      },
    }

    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(null)
  })
})
