import { OffersModuleParameters } from 'features/home/types'
import { SearchParametersFields } from 'libs/contentful/types'

export const mapOffersSubcategories = (
  algoliaSubcategories: SearchParametersFields['algoliaSubcategories']
) => algoliaSubcategories?.fields?.subcategories

export const mapOffersMovieGenres = (movieGenres: SearchParametersFields['movieGenres']) =>
  movieGenres?.fields?.movieGenres

export const mapOffersShowTypes = (showTypes: SearchParametersFields['showTypes']) =>
  showTypes?.fields?.showTypes

export const mapOffersCategories = (
  algoliaCategories: SearchParametersFields['algoliaCategories']
): OffersModuleParameters['categories'] => algoliaCategories?.fields?.categories

export const mapMusicTypes = (
  musicTypes: SearchParametersFields['musicTypes']
): OffersModuleParameters['musicTypes'] => musicTypes?.fields?.musicTypes

export const mapBookTypes = (
  bookTypes: SearchParametersFields['bookTypes']
): OffersModuleParameters['bookTypes'] => bookTypes?.fields?.bookTypes
