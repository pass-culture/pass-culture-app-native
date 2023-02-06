import { HomepageModuleType, RecommendedOffersModule } from 'features/home/types'
import {
  RecommendationContentModel,
  RecommendationParameters,
  RecommendationParametersFields,
} from 'libs/contentful/types'

const mapRecommendationSubcategories = (
  recoSubcategories: RecommendationParametersFields['recommendationSubcategories']
) => recoSubcategories?.fields?.subcategories

const mapRecommendationCategories = (
  recoCategories: RecommendationParametersFields['recommendationCategories']
) => recoCategories?.fields?.categories

const buildRecommendationParams = (
  recommendationParams: RecommendationParameters
): RecommendedOffersModule['recommendationParameters'] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { recommendationSubcategories, recommendationCategories, title, ...otherFields } =
    recommendationParams.fields
  return {
    ...otherFields,
    subcategories: mapRecommendationSubcategories(recommendationSubcategories),
    categories: mapRecommendationCategories(recommendationCategories),
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
