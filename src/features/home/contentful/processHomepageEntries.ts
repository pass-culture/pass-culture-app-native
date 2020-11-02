import {
  HomepageEntries,
  Module,
  ModuleFields,
  CONTENT_TYPES,
  CoverParameters,
  AlgoliaParameters,
} from './contentful.d'
import {
  Offers,
  OffersWithCover,
  ExclusivityPane,
  BusinessPane,
  ProcessedModule,
} from './moduleTypes'

export const processHomepageEntries = (homepage: HomepageEntries): Array<ProcessedModule> => {
  const {
    fields: { modules },
  } = homepage

  const processedModules = modules.map((module: Module) => {
    const { fields }: { fields: ModuleFields } = module
    if (!fields || !hasAtLeastOneField(fields)) return

    const contentType = getContentType(module)
    if (contentType === CONTENT_TYPES.ALGOLIA) {
      const { algoliaParameters, displayParameters, cover } = fields

      // algoliaParameters and displayParameters are required for algolia modules
      if (!algoliaParameters || !displayParameters || !hasAtLeastOneField(algoliaParameters)) return
      const { fields: algolia } = algoliaParameters
      const { fields: display } = displayParameters

      if (cover && hasAtLeastOneField(cover)) {
        return new OffersWithCover({ algolia, cover: buildImageUrl(cover.fields), display })
      } else {
        return new Offers({ algolia, display })
      }
    }

    if (contentType === CONTENT_TYPES.EXCLUSIVITY) {
      const { alt, offerId } = fields
      const image = buildImageUrl(fields)
      // Those 3 fields are required for the exclusivity module in Contentful
      if (alt && image && offerId) return new ExclusivityPane({ alt, image, offerId })
    }

    if (contentType === CONTENT_TYPES.BUSINESS) {
      const { firstLine, secondLine, url } = fields
      return new BusinessPane({ firstLine, image: buildImageUrl(fields), secondLine, url })
    }

    return
  })

  // We shouldn't be needing the 'as' next line
  return processedModules.filter(Boolean) as Array<ProcessedModule>
}

const buildImageUrl = (fields: CoverParameters['fields']): string | null => {
  const image = fields.image
  if (image && hasAtLeastOneField(image.fields)) {
    const { url } = image.fields.file
    return url ? `https:${url}` : null
  }
  return null
}

const hasAtLeastOneField = (
  object: ModuleFields | CoverParameters | AlgoliaParameters | Record<string, unknown>
) => {
  return Object.keys(object).length > 0
}

const getContentType = (module: Module) => {
  const { contentType } = module.sys
  return contentType && contentType.sys.id
}
