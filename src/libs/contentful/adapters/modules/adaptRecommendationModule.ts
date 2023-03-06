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

const mapBookTypes = (recoCategories: RecommendationParametersFields['bookTypes']) =>
  recoCategories?.fields?.bookTypes

const buildRecommendationParams = (
  recommendationParams: RecommendationParameters
): RecommendedOffersModule['recommendationParameters'] => {
  const {
    recommendationSubcategories,
    recommendationCategories,
    bookTypes,
    title: _title,
    ...otherFields
  } = recommendationParams.fields
  return {
    ...otherFields,
    bookTypes: mapBookTypes(bookTypes),
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
