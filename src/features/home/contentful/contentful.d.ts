interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<EntryCollectionError>
  includes?: EntryCollectionInclusions
}

interface EntryFields {
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

interface AlgoliaParameters {
  sys: Sys
  fields: AlgoliaParametersFields
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/cover/fields
interface CoverFields {
  title: string
  image: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algolia/fields
interface AgoliaFields {
  title: string
  algoliaParameters: AlgoliaParametersFields
  displayParameters: DisplayParametersFields
  cover: CoverFields
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algoliaParameters/fields
interface AlgoliaParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  categories?: string[]
  tags?: string[]
  isDigital?: boolean
  isThing?: boolean
  isEvent?: boolean
  beginningDatetime?: string
  endingDatetime?: string
  isFree?: boolean
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  newestOnly?: boolean
  hitsPerPage: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/displayParameters/fields
interface DisplayParametersFields {
  title: string
  layout: string
  minOffers: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/business/fields
interface BusinessFields {
  title: string
  firstLine?: string
  secondLine?: string
  image: string
  url?: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/exclusivity/fields
interface ExclusivityFields {
  title: string
  alt: string
  image: string
  offerId: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types
type ModuleFields =
  | AgoliaFields
  | AgoliaParametersFields
  | BusinessFields
  | CoverFields
  | DisplayParametersFields
  | ExclusivityFields
  | HomepageFields

interface DisplayParameters {
  sys: Sys
  fields: DisplayParametersFields
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

interface HomepageEntries {
  sys: Sys
  fields: {
    modules: Array<Module>
  }
}

interface Module {
  sys: Sys
  fields: ModuleFields
}

export const CONTENT_TYPES = {
  ALGOLIA: 'algolia',
  EXCLUSIVITY: 'exclusivity',
  HOMEPAGE: 'homepage',
  INFORMATION: 'information',
  BUSINESS: 'business',
}

export type {
  Module,
  AlgoliaParameters,
  CoverParameters,
  AlgoliaParametersFields,
  DisplayParametersFields,
  EntryCollection,
  EntryFields,
  HomepageEntries,
  ModuleFields,
}
