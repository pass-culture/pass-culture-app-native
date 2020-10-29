import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { getHomepageEntries } from 'features/home/api'
import {
  Offers,
  OffersWithCover,
  ExclusivityPane,
  BusinessPane,
  ProcessedModule,
} from 'features/home/components/moduleTypes'
import {
  HomepageEntries,
  Module,
  ModuleFields,
  CONTENT_TYPES,
  CoverParameters,
  AlgoliaParameters,
} from 'features/home/contentful.d'

export const useHomePageModules = (): Array<ProcessedModule> => {
  const [modules, setModules] = useState<Array<ProcessedModule>>([])

  useEffect(() => {
    getHomepageModules()
      .then(setModules)
      .catch((error: string) => Alert.alert('Cannot fetch homepage modules', JSON.stringify(error)))
  }, [])

  return modules
}

export const getHomepageModules = async (): Promise<Array<ProcessedModule>> => {
  try {
    const homepageEntries = await getHomepageEntries()
    // TODO: handle errors
    if (!homepageEntries) return []
    const modules = processHomepageEntries(homepageEntries)
    return modules
  } catch (error) {
    console.error(error)
    return []
  }
}

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
