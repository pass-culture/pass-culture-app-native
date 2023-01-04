import isEmpty from 'lodash/isEmpty'

import { HomepageModuleType, OffersModule } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { AlgoliaContentModel, AlgoliaParameters } from 'libs/contentful/types'

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .filter((params) => params.fields && !isEmpty(params.fields))
    .map(({ fields }) => fields)

export const adaptOffersModule = (modules: AlgoliaContentModel): OffersModule | null => {
  const additionalAlgoliaParameters = modules.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(
    modules.fields.algoliaParameters,
    additionalAlgoliaParameters
  )

  if (offersList.length === 0) return null

  const coverUrl = modules.fields.cover
    ? buildImageUrl(modules.fields.cover.fields.image?.fields.file.url)
    : undefined

  return {
    type: HomepageModuleType.OffersModule,
    id: modules.sys.id,
    title: modules.fields.title,
    displayParameters: modules.fields.displayParameters.fields,
    offersModuleParameters: offersList,
    cover: coverUrl,
  }
}
