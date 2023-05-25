import { HomepageModuleType, OffersModule, OffersModuleParameters } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { adaptOffersModuleParameters } from 'libs/contentful/adapters/modules/helpers/adaptOffersModuleParameters'
import { AlgoliaContentModel, AlgoliaParameters } from 'libs/contentful/types'

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .map(adaptOffersModuleParameters)
    .filter((m): m is OffersModuleParameters => m !== null)

export const adaptOffersModule = (module: AlgoliaContentModel): OffersModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
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
