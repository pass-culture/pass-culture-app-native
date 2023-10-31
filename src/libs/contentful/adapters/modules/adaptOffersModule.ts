import { HomepageModuleType, OffersModule } from 'features/home/types'
import { buildOffersParams } from 'libs/contentful/adapters/helpers/buildOffersParams'
import { AlgoliaContentModel } from 'libs/contentful/types'

export const adaptOffersModule = (module: AlgoliaContentModel): OffersModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null
  if (module.fields.displayParameters.fields === undefined) return null

  const additionalAlgoliaParameters = module.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(module.fields.algoliaParameters, additionalAlgoliaParameters)

  if (offersList.length === 0) return null

  return {
    type: HomepageModuleType.OffersModule,
    id: module.sys.id,
    title: module.fields.title,
    displayParameters: module.fields.displayParameters.fields,
    offersModuleParameters: offersList,
  }
}
