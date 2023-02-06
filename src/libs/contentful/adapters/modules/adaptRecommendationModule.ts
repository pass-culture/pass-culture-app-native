import { HomepageModuleType, RecommendedOffersModule } from 'features/home/types'
import {
  RecommendationContentModel,
  RecommendationParameters,
  RecommendationParametersFields,
} from 'libs/contentful/types'

const mapRecommendationSubcategories = (
  recoSubcategories: RecommendationParametersFields['recommendationSubcategories']
) => recoSubcategories?.fields?.subcategories


const buildRecommendationParams = (
  recommendationParams: RecommendationParameters
): RecommendedOffersModule['recommendationParameters'] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { recommendationSubcategories, title, ...otherFields } = recommendationParams.fields
  return {
    subcategories: mapRecommendationSubcategories(recommendationSubcategories),
    ...otherFields,
  }
}
export const adaptRecommendationModule = (
  modules: RecommendationContentModel
): RecommendedOffersModule => {
  const { recommendationParameters } = modules.fields
  const cleanRecommendationParameters = recommendationParameters
    ? buildRecommendationParams(recommendationParameters)
    : undefined

  return {
    type: HomepageModuleType.RecommendedOffersModule,
    id: modules.sys.id,
    displayParameters: modules.fields.displayParameters.fields,
    recommendationParameters: cleanRecommendationParameters,
  }
}
