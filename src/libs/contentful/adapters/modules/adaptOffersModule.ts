import { HomepageModuleType, OffersModule } from 'features/home/types'
import { buildOffersParams } from 'libs/contentful/adapters/helpers/buildOffersParams'
import { buildRecommendationParams } from 'libs/contentful/adapters/modules/adaptRecommendationModule'
import { AlgoliaContentModel } from 'libs/contentful/types'

import { ContentfulAdapter } from '../ContentfulAdapterFactory'

export const adaptOffersModule: ContentfulAdapter<AlgoliaContentModel, OffersModule> = (module) => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null
  if (module.fields.displayParameters.fields === undefined) return null

  const additionalAlgoliaParameters = module.fields.additionalAlgoliaParameters ?? []
  const { recommendationParameters } = module.fields
  const cleanRecommendationParameters = buildRecommendationParams(recommendationParameters)
  const offersList = buildOffersParams(module.fields.algoliaParameters, additionalAlgoliaParameters)

  if (offersList.length === 0) return null

  return {
    type: HomepageModuleType.OffersModule,
    id: module.sys.id,
    title: module.fields.title,
    displayParameters: module.fields.displayParameters.fields,
    offersModuleParameters: offersList,
    recommendationParameters: cleanRecommendationParameters,
  }
}
