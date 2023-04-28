import { HomepageModuleType, OffersModule } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  mapOffersSubcategories,
  mapOffersMovieGenres,
  mapOffersCategories,
  mapOffersShowTypes,
  mapMusicTypes,
  mapBookTypes,
} from 'libs/contentful/adapters/modules/helpers/offersModuleMappers'
import {
  ProvidedAlgoliaParameters,
  AlgoliaContentModel,
  AlgoliaParameters,
} from 'libs/contentful/types'

const parametersHaveFields = (
  parameters: AlgoliaParameters
): parameters is ProvidedAlgoliaParameters => !!parameters?.fields

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .filter(parametersHaveFields)
    .map(
      ({
        fields: {
          algoliaSubcategories,
          algoliaCategories,
          movieGenres,
          musicTypes,
          showTypes,
          bookTypes,
          ...otherFields
        },
      }) => ({
        ...otherFields,
        subcategories: mapOffersSubcategories(algoliaSubcategories),
        movieGenres: mapOffersMovieGenres(movieGenres),
        categories: mapOffersCategories(algoliaCategories),
        showTypes: mapOffersShowTypes(showTypes),
        musicTypes: mapMusicTypes(musicTypes),
        bookTypes: mapBookTypes(bookTypes),
      })
    )

export const adaptOffersModule = (module: AlgoliaContentModel): OffersModule | null => {
  if (module.fields === undefined) return null
  if (module.fields.displayParameters.fields === undefined) return null

  const additionalAlgoliaParameters = module.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(module.fields.algoliaParameters, additionalAlgoliaParameters)

  if (offersList.length === 0) return null

  const coverUrl = buildImageUrl(module.fields.cover?.fields?.image.fields?.file.url)

  return {
    type: HomepageModuleType.OffersModule,
    id: module.sys.id,
    title: module.fields.title,
    displayParameters: module.fields.displayParameters.fields,
    offersModuleParameters: offersList,
    cover: coverUrl,
  }
}
