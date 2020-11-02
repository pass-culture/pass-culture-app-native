export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<EntryCollectionError>
  includes?: EntryCollectionInclusions
}

export interface EntryFields {
  modules: Array<{ sys: EntryTypeLink }>
  title: string
}

interface ContentfulCollection<T> {
  total: number
  skip: number
  limit: number
  items: Array<T>
}

interface Entry<T> {
  sys: Sys
  fields: T
  update(): Promise<Entry<T>>
}

interface Asset {
  sys: Sys
  fields: {
    title: string
    description: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

interface Sys {
  type: string
  id: string
  createdAt: string
  updatedAt: string
  locale: string
  revision?: number
  space?: {
    sys: SpaceLink
  }
  contentType?: {
    sys: ContentTypeLink
  }
}

interface SpaceLink {
  type: string
  linkType: string
  id: string
}

interface ContentTypeLink {
  type: string
  linkType: string
  id: string
}

interface EntryTypeLink {
  type: string
  linkType: string
  id: string
}

interface EntryCollectionError {
  sys: {
    id: string
    type: string
  }
  details: {
    type: string
    linkType: string
    id: string
  }
}

interface EntryCollectionInclusions<T> {
  [string]: Array<Asset | Entry<T>>
}

export interface AlgoliaParameters {
  sys: Sys
  fields: AlgoliaParametersFields
}

export interface AlgoliaParametersFields {
  title?: stirng
  tags?: Array<string>
  hitsPerPage?: number
}

export interface DisplayParameters {
  sys: Sys
  fields: DisplayParametersFields
}

export interface DisplayParametersFields {
  title?: string
  layout?: string
  minOffers?: number
}

interface CoverParameters {
  sys: Sys
  fields: {
    title?: string
    image?: Image
  }
}

interface Image {
  sys: Sys
  fields: {
    title: string
    file: {
      url: string
      details: {
        size: number
        image: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

export interface HomepageEntries {
  sys: Sys
  fields: {
    modules: Array<Module>
  }
}

export interface Module {
  sys: Sys
  fields: ModuleFields
}

export interface ModuleFields {
  title: string
  algoliaParameters?: AlgoliaParameters
  displayParameters?: DisplayParameters
  cover?: CoverParameters
  alt?: string
  offerId?: string
  firstLine?: string
  secondLine?: string
  url?: string
}

export const CONTENT_TYPES = {
  ALGOLIA: 'algolia',
  EXCLUSIVITY: 'exclusivity',
  HOMEPAGE: 'homepage',
  INFORMATION: 'information',
  BUSINESS: 'business',
}
