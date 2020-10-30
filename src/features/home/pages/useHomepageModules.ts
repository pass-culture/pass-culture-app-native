import { getHomepageEntries } from 'features/home/api'
import {
  Offers,
  OffersWithCover,
  ExclusivityPane,
  BusinessPane,
} from 'features/home/components/moduleTypes'
import { HomepageEntries, Module, ModuleFields, CONTENT_TYPES } from 'features/home/contentful.d'

export const getHomepageModules = async () => {
  try {
    const homepageEntries = await getHomepageEntries()
    // TODO: handle errors
    if (!homepageEntries) return
    const modules = processHomepageEntries(homepageEntries)
    return modules
  } catch (error) {
    console.error(error)
    return
  }
}

const processHomepageEntries = (homepage: HomepageEntries) => {
  const {
    fields: { modules },
  } = homepage

  return modules
    .map((module: Module) => {
      const { fields }: { fields: ModuleFields } = module

      if (fields && hasAtLeastOneField(fields)) {
        if (matchesContentType(module, CONTENT_TYPES.ALGOLIA)) {
          const algoliaParameters = fields.algoliaParameters || {}
          const displayParameters = fields.displayParameters || {}

          if (hasAtLeastOneField(algoliaParameters)) {
            if (fields.cover) {
              const cover = fields.cover

              if (hasAtLeastOneField(cover)) {
                return new OffersWithCover({
                  algolia: algoliaParameters,
                  cover: buildImageUrl(cover.fields),
                  display: displayParameters,
                })
              }
            } else {
              return new Offers({
                algolia: algoliaParameters,
                display: displayParameters,
              })
            }
          }
        } else {
          if (matchesContentType(module, CONTENT_TYPES.EXCLUSIVITY)) {
            return new ExclusivityPane({
              alt: fields.alt,
              image: buildImageUrl(fields),
              offerId: fields.offerId,
            })
          }
          return new BusinessPane({
            firstLine: fields.firstLine,
            image: buildImageUrl(fields),
            secondLine: fields.secondLine,
            url: fields.url,
          })
        }
      }
      return undefined
    })
    .filter((module) => module !== undefined)
}

const buildImageUrl = (fields: any): string | null => {
  const image = fields.image

  if (image && hasAtLeastOneField(image.fields)) {
    const file = image.fields.file

    if (file.url) {
      return `https:${fields.image.fields.file.url}`
    }
  }
  return null
}

const hasAtLeastOneField = (object: any) => {
  return Object.keys(object).length > 0
}

const matchesContentType = (module: Module, contentType: string) => {
  const {
    sys: {
      contentType: {
        sys: { id },
      },
    },
  } = module
  return id === contentType
}
