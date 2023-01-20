import isEmpty from 'lodash/isEmpty'

import { HomepageModuleType, OffersModule } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  AlgoliaContentModel,
  AlgoliaParameters,
  SearchParametersFields,
} from 'libs/contentful/types'

const mapOffersParametersWithSubcategories = ({
  algoliaSubcategories,
  ...otherParams
}: SearchParametersFields) => ({
  subcategories: algoliaSubcategories?.fields?.subcategories,
  ...otherParams,
})

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] => {
  const offersParameterFields = [firstParams, ...additionalParams]
    .filter((params) => params.fields && !isEmpty(params.fields))
    .map(({ fields }) => fields)

  return offersParameterFields.map(mapOffersParametersWithSubcategories)
}

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
