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

    if (matchesContentType(module, CONTENT_TYPES.ALGOLIA)) {
      const algoliaParameters = fields.algoliaParameters || {}
      const displayParameters = fields.displayParameters || {}
      if (!hasAtLeastOneField(algoliaParameters)) return

      const { cover } = fields
      if (cover && hasAtLeastOneField(cover)) {
        return new OffersWithCover({
          algolia: algoliaParameters,
          cover: buildImageUrl(cover.fields),
          display: displayParameters,
        })
      } else {
        return new Offers({
          algolia: algoliaParameters,
          display: displayParameters,
        })
      }
    } else if (matchesContentType(module, CONTENT_TYPES.EXCLUSIVITY)) {
      const { alt, offerId } = fields
      const image = buildImageUrl(fields)
      if (alt && image && offerId) {
        // Those 3 fields are required in Contentful. Shouldn't be undefined
        return new ExclusivityPane({ alt, image, offerId })
      }
    } else if (matchesContentType(module, CONTENT_TYPES.BUSINESS)) {
      return new BusinessPane({
        firstLine: fields.firstLine,
        image: buildImageUrl(fields),
        secondLine: fields.secondLine,
        url: fields.url,
      })
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

const matchesContentType = (module: Module, contentType: string) => {
  const id = module.sys.contentType?.sys.id
  return id === contentType
}
