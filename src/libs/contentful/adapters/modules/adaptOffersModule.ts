import isEmpty from 'lodash/isEmpty'

import { HomepageModuleType, OffersModule, OffersModuleParameters } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  AlgoliaContentModel,
  AlgoliaParameters,
  SearchParametersFields,
} from 'libs/contentful/types'

const mapOffersSubcategories = (
  algoliaSubcategories: SearchParametersFields['algoliaSubcategories']
) => algoliaSubcategories?.fields?.subcategories

const mapOffersMovieGenres = (movieGenres: SearchParametersFields['movieGenres']) =>
  movieGenres?.fields?.movieGenres

const mapOffersShowTypes = (showTypes: SearchParametersFields['showTypes']) =>
  showTypes?.fields?.showTypes

const mapOffersCategories = (
  algoliaCategories: SearchParametersFields['algoliaCategories']
): OffersModuleParameters['categories'] => algoliaCategories?.fields?.categories

const mapMusicTypes = (
  musicTypes: SearchParametersFields['musicTypes']
): OffersModuleParameters['musicTypes'] => musicTypes?.fields?.musicTypes

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .filter((params) => params.fields && !isEmpty(params.fields))
    .map(
      ({
        fields: {
          algoliaSubcategories,
          algoliaCategories,
          movieGenres,
          musicTypes,
          showTypes,
          ...otherFields
        },
      }) => ({
        ...otherFields,
        subcategories: mapOffersSubcategories(algoliaSubcategories),
        movieGenres: mapOffersMovieGenres(movieGenres),
        categories: mapOffersCategories(algoliaCategories),
        showTypes: mapOffersShowTypes(showTypes),
        musicTypes: mapMusicTypes(musicTypes),
      })
    )

export const adaptOffersModule = (module: AlgoliaContentModel): OffersModule | null => {
  const additionalAlgoliaParameters = module.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(module.fields.algoliaParameters, additionalAlgoliaParameters)

  if (offersList.length === 0) return null

  const coverUrl = module.fields.cover
    ? buildImageUrl(module.fields.cover.fields.image?.fields.file.url)
    : undefined

  return {
    type: HomepageModuleType.OffersModule,
    id: module.sys.id,
    title: module.fields.title,
    displayParameters: module.fields.displayParameters.fields,
    offersModuleParameters: offersList,
    cover: coverUrl,
  }
}
