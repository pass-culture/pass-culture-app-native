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

export const parseOfferId = (offerId: string): number | null => {
  return Number.isNaN(Number(offerId)) ? null : Number(offerId)
}

const buildAlgoliaModule = (
  fields: AlgoliaFields,
  moduleId: string
): Offers | OffersWithCover | undefined => {
  const { algoliaParameters, displayParameters, cover, additionalAlgoliaParameters = [] } = fields
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

const buildRecommendation = (fields: RecommendationFields): RecommendationPane => {
  const { fields: display } = fields.displayParameters
  return new RecommendationPane({ display })
}

const buildExclusivity = (
  fields: ExclusivityFields,
  moduleId: string
): ExclusivityPane | undefined => {
  const { alt, offerId, image, displayParameters } = fields
  const { fields: display = undefined } = displayParameters || {}
  const id = parseOfferId(offerId)
  if (typeof id !== 'number') return

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new ExclusivityPane({ alt, image: buildImageUrl(image)!, id, moduleId, display })
}

const buildVenuesPlaylist = (fields: VenuesFields, moduleId: string): VenuesModule | undefined => {
  const { venuesSearchParameters, displayParameters } = fields
  const search = buildSearchVenuesParams(venuesSearchParameters)
  if (search.length === 0) return

  const { fields: display } = displayParameters
  return new VenuesModule({ display, search, moduleId })
}

const buildBusiness = (fields: BusinessFields, moduleId: string): BusinessPane | undefined => {
  const { title, firstLine, secondLine, leftIcon, url, image, targetNotConnectedUsersOnly } = fields

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

const getModuleId = (module: HomepageModule): string => module.sys.id

export const processHomepageEntry = (homepage: HomepageEntry): ProcessedModule[] =>
  homepage.fields.modules
    .map((module) => {
      const { fields } = module
      if (!fields || !hasAtLeastOneField(fields)) return

      const contentType = getContentType(module)
      const moduleId = getModuleId(module)

      switch (contentType) {
        case CONTENT_TYPES.ALGOLIA:
          return buildAlgoliaModule(fields as AlgoliaFields, moduleId)
        case CONTENT_TYPES.RECOMMENDATION:
          return buildRecommendation(fields as RecommendationFields)
        case CONTENT_TYPES.EXCLUSIVITY:
          return buildExclusivity(fields as ExclusivityFields, moduleId)
        case CONTENT_TYPES.VENUES_PLAYLIST:
          return buildVenuesPlaylist(fields as VenuesFields, moduleId)
        case CONTENT_TYPES.BUSINESS:
          return buildBusiness(fields as BusinessFields, moduleId)
        default:
          return
      }
    })
    .filter(Boolean) as ProcessedModule[]

export const buildSearchParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): SearchParametersFields[] =>
  [firstParams, ...additionalParams]
    .filter((params) => params.fields && hasAtLeastOneField(params.fields))
    .map(({ fields }) => fields)

const buildSearchVenuesParams = (
  venuesParams: VenuesSearchParameters[]
): VenuesSearchParametersFields[] =>
  venuesParams
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
