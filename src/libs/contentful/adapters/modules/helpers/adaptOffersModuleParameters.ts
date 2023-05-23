import { OffersModuleParameters } from 'features/home/types'
import {
  mapBookTypes,
  mapMusicTypes,
  mapOffersCategories,
  mapOffersMovieGenres,
  mapOffersShowTypes,
  mapOffersSubcategories,
} from 'libs/contentful/adapters/modules/helpers/offersModuleMappers'
import { AlgoliaParameters, ProvidedAlgoliaParameters } from 'libs/contentful/types'

const parametersHaveFields = (
  parameters: AlgoliaParameters
): parameters is ProvidedAlgoliaParameters => !!parameters?.fields

export const adaptOffersModuleParameters = (
  parameters: AlgoliaParameters
): OffersModuleParameters | null => {
  if (!parametersHaveFields(parameters)) return null

  const {
    fields: {
      algoliaSubcategories,
      algoliaCategories,
      movieGenres,
      musicTypes,
      showTypes,
      bookTypes,
      ...otherFields
    },
  } = parameters

  return {
    ...otherFields,
    subcategories: mapOffersSubcategories(algoliaSubcategories),
    movieGenres: mapOffersMovieGenres(movieGenres),
    categories: mapOffersCategories(algoliaCategories),
    showTypes: mapOffersShowTypes(showTypes),
    musicTypes: mapMusicTypes(musicTypes),
    bookTypes: mapBookTypes(bookTypes),
  }
}
