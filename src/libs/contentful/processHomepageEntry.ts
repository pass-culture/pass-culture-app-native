import {
  AlgoliaFields,
  BusinessFields,
  ExclusivityFields,
  HomepageEntry,
  HomepageModule,
  ContentTypes,
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

export const parseOfferId = (offerId: string): number | undefined => {
  return Number.isNaN(Number(offerId)) ? undefined : Number(offerId)
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

const buildRecommendation = (
  fields: RecommendationFields,
  moduleId: string
): RecommendationPane => {
  const displayParameters = fields.displayParameters.fields
  const recommendationParameters = fields.recommendationParameters?.fields
  return new RecommendationPane({ displayParameters, moduleId, recommendationParameters })
}

const buildExclusivity = (
  fields: ExclusivityFields,
  moduleId: string
): ExclusivityPane | undefined => {
  const { title, alt, offerId, image, displayParameters, url } = fields
  const { fields: display = undefined } = displayParameters || {}

  return new ExclusivityPane({
    title,
    alt,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    image: buildImageUrl(image)!,
    offerId: parseOfferId(offerId),
    moduleId,
    display,
    url,
  })
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
        case ContentTypes.ALGOLIA:
          return buildAlgoliaModule(fields as AlgoliaFields, moduleId)
        case ContentTypes.RECOMMENDATION:
          return buildRecommendation(fields as RecommendationFields, moduleId)
        case ContentTypes.EXCLUSIVITY:
          return buildExclusivity(fields as ExclusivityFields, moduleId)
        case ContentTypes.VENUES_PLAYLIST:
          return buildVenuesPlaylist(fields as VenuesFields, moduleId)
        case ContentTypes.BUSINESS:
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
