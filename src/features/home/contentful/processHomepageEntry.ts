import { dehumanizeId } from 'features/offer/services/dehumanizeId'

import {
  AlgoliaFields,
  BusinessFields,
  ExclusivityFields,
  HomepageEntry,
  HomepageModule,
  CONTENT_TYPES,
  Image,
  RecommendationFields,
  AlgoliaParameters,
  SearchParametersFields,
  VenuesFields,
  VenuesSearchParameters,
  VenuesSearchParametersFields,
} from './contentful'
import {
  Offers,
  OffersWithCover,
  ExclusivityPane,
  BusinessPane,
  ProcessedModule,
  RecommendationPane,
  VenuesModule,
} from './moduleTypes'

// Offer can be humanized (before) or a number (now) in contenful
export const parseOfferId = (offerId: string): number | null => {
  // If the offer is only digits: we assume it the offer id (non humanized)
  if (offerId.match(/^[0-9]+$/)) return parseInt(offerId, 10)

  return dehumanizeId(offerId)
}

export const processHomepageEntry = (homepage: HomepageEntry): ProcessedModule[] => {
  const {
    fields: { modules },
  } = homepage
  const processedModules = modules.map((module) => {
    const {
      fields,
      sys: { id: moduleId },
    } = module
    if (!fields || !hasAtLeastOneField(fields)) return

    const contentType = getContentType(module)
    if (contentType === 'algolia') {
      const {
        algoliaParameters,
        displayParameters,
        cover,
        additionalAlgoliaParameters = [],
      } = fields as AlgoliaFields
      const search = buildSearchParams(algoliaParameters, additionalAlgoliaParameters)
      if (search.length === 0) return

      const { fields: display } = displayParameters

      if (cover && hasAtLeastOneField(cover)) {
        return new OffersWithCover({
          search,
          cover: buildImageUrl(cover.fields.image),
          display,
          moduleId,
        })
      }
      return new Offers({ search, display, moduleId })
    }

    if (contentType === 'recommendation') {
      const { displayParameters } = fields as RecommendationFields
      const { fields: display } = displayParameters
      return new RecommendationPane({ display })
    }

    if (contentType === 'exclusivity') {
      const { alt, offerId, image, displayParameters } = fields as ExclusivityFields
      const { fields: display = undefined } = displayParameters || {}
      const id = parseOfferId(offerId)
      if (typeof id !== 'number') return

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return new ExclusivityPane({ alt, image: buildImageUrl(image)!, id, moduleId, display })
    }

    if (contentType === 'venuesPlaylist') {
      const { venuesSearchParameters, displayParameters } = fields as VenuesFields
      const search = buildSearchVenuesParams(venuesSearchParameters)
      if (search.length === 0) return

      const { fields: display } = displayParameters
      return new VenuesModule({ display, search, moduleId })
    }

    if (contentType === CONTENT_TYPES.BUSINESS) {
      const { title, firstLine, secondLine, leftIcon, url, image, targetNotConnectedUsersOnly } =
        fields as BusinessFields

      return new BusinessPane({
        title,
        firstLine,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        image: buildImageUrl(image)!,
        secondLine,
        leftIcon: (leftIcon && buildImageUrl(leftIcon)) || undefined,
        url,
        moduleId,
        targetNotConnectedUsersOnly,
      })
    }

    return
  })

  return processedModules.filter(Boolean) as ProcessedModule[]
}

export const buildSearchParams = (
  params: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): SearchParametersFields[] => {
  const allParams = [params, ...additionalParams]
  const publishedAdditionalSearchParams = allParams
    .filter((params) => params.fields && hasAtLeastOneField(params.fields))
    .map(({ fields }) => fields)

  return publishedAdditionalSearchParams
}

const buildSearchVenuesParams = (
  params: VenuesSearchParameters[]
): VenuesSearchParametersFields[] =>
  params
    .filter((params) => params.fields && hasAtLeastOneField(params.fields))
    .map(({ fields }) => fields)

const buildImageUrl = (image: Image): string | null => {
  if (image && hasAtLeastOneField(image.fields)) {
    const { url } = image.fields.file
    return url ? `https:${url}` : null
  }
  return null
}

// eslint-disable-next-line
const hasAtLeastOneField = (object: any) => {
  return Object.keys(object).length > 0
}

const getContentType = (module: HomepageModule) => {
  const { contentType } = module.sys
  return contentType && contentType.sys.id
}
