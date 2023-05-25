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

const mapBookTypes = (recoBookTypes: RecommendationParametersFields['bookTypes']) =>
  recoBookTypes?.fields?.bookTypes

const mapMovieGenres = (recoMovieGenres: RecommendationParametersFields['movieGenres']) =>
  recoMovieGenres?.fields?.movieGenres

const mapMusicTypes = (recoMusicTypes: RecommendationParametersFields['musicTypes']) =>
  recoMusicTypes?.fields?.musicTypes

const mapShowTypes = (recoShowTypes: RecommendationParametersFields['showTypes']) =>
  recoShowTypes?.fields?.showTypes

const buildRecommendationParams = (
  recommendationParams?: RecommendationParameters
): RecommendedOffersModule['recommendationParameters'] | undefined => {
  if (recommendationParams?.fields === undefined) return undefined

  const {
    recommendationSubcategories,
    recommendationCategories,
    bookTypes,
    movieGenres,
    musicTypes,
    showTypes,
    title: _title,
    ...otherFields
  } = recommendationParams.fields
  return {
    ...otherFields,
    showTypes: mapShowTypes(showTypes),
    musicTypes: mapMusicTypes(musicTypes),
    movieGenres: mapMovieGenres(movieGenres),
    bookTypes: mapBookTypes(bookTypes),
    subcategories: mapRecommendationSubcategories(recommendationSubcategories),
    categories: mapRecommendationCategories(recommendationCategories),
  }
}
export const adaptRecommendationModule = (
  modules: RecommendationContentModel
): RecommendedOffersModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (modules.fields === undefined) return null
  if (modules.fields.displayParameters.fields === undefined) return null

  const { recommendationParameters } = modules.fields
  const cleanRecommendationParameters = buildRecommendationParams(recommendationParameters)

  return {
    type: HomepageModuleType.RecommendedOffersModule,
    id: modules.sys.id,
    displayParameters: modules.fields.displayParameters.fields,
    recommendationParameters: cleanRecommendationParameters,
  }
}
