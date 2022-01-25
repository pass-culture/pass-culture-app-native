export const CONTENT_TYPES = {
  ALGOLIA: 'algolia',
  ALGOLIA_PARAMETERS: 'algoliaParameters',
  DISPLAY_PARAMETERS: 'displayParameters',
  EXCLUSIVITY: 'exclusivity',
  EXCLUSIVITY_DISPLAY_PARAMETERS: 'exclusivityDisplayParameters',
  HOMEPAGE_NATIF: 'homepageNatif',
  INFORMATION: 'information',
  BUSINESS: 'business',
  RECOMMENDATION: 'recommendation',
  VENUES_PLAYLIST: 'venuesPlaylist',
  VENUES_SEARCH_PARAMETERS: 'venuesSearchParameters',
}

export type Layout = 'two-items' | 'one-item-medium'

export interface Entry<T, ContentType> {
  sys: Sys<ContentType>
  fields: T
  update(): Promise<Entry<T, ContentType>>
}

interface EntryCollectionInclusions<T, ContentType> {
  string: Array<Asset<ContentType> | Entry<T, ContentType>>
}

export interface EntryCollection<T, ContentType>
  extends ContentfulCollection<Entry<T, ContentType>> {
  errors?: Array<EntryCollectionError>
  includes?: EntryCollectionInclusions<T, ContentType>
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

interface Asset<ContentType> {
  sys: Sys<ContentType>
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
      contentType: ContentType
    }
  }
}

interface Sys<ContentType> {
  type: string
  id: string
  createdAt: string
  updatedAt: string
  environment: { sys: { id: string; type: string; linkType: string } }
  locale: string
  revision?: number
  space?: {
    sys: SpaceLink
  }
  contentType?: {
    sys: {
      type: string
      linkType: string
      id: ContentType
    }
  }
}

interface SpaceLink {
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

export interface AlgoliaParameters {
  sys: Sys<typeof CONTENT_TYPES.ALGOLIA>
  fields: SearchParametersFields
}

export interface VenuesSearchParameters {
  sys: Sys<typeof CONTENT_TYPES.VENUES_PLAYLIST>
  fields: VenuesSearchParametersFields
}

export interface DisplayParameters {
  sys: Sys<typeof CONTENT_TYPES.DISPLAY_PARAMETERS>
  fields: DisplayParametersFields
}

export interface ExcluDisplayParameters {
  sys: Sys<typeof CONTENT_TYPES.EXCLUSIVITY_DISPLAY_PARAMETERS>
  fields: ExclusivityDisplayParametersFields
}

export interface Cover {
  sys: Sys<typeof CONTENT_TYPES.INFORMATION>
  fields: CoverFields
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/cover/fields
interface CoverFields {
  title: string
  image: Image
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algolia/fields
export interface AlgoliaFields {
  title: string
  algoliaParameters: AlgoliaParameters
  displayParameters: DisplayParameters
  cover?: Cover
  additionalAlgoliaParameters?: AlgoliaParameters[]
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/venuesPlaylist/fields
export interface VenuesFields {
  title: string
  venuesSearchParameters: VenuesSearchParameters[]
  displayParameters: DisplayParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/recommendation/fields
export interface RecommendationFields {
  title: string
  displayParameters: DisplayParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algoliaParameters/fields
export interface SearchParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  categories?: string[]
  subcategories?: string[]
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

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/venuesSearchParameters/fields
export interface VenuesSearchParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/displayParameters/fields
export interface DisplayParametersFields {
  title: string
  layout: Layout
  minOffers: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/exclusivityDisplayParameters/fields
export interface ExclusivityDisplayParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/business/fields
export interface BusinessFields {
  title: string
  firstLine?: string
  secondLine?: string
  leftIcon?: Image
  image: Image
  url?: string
  targetNotConnectedUsersOnly?: boolean
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/exclusivity/fields
export interface ExclusivityFields {
  title: string
  alt: string
  image: Image
  offerId: string
  displayParameters?: ExcluDisplayParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/homepageNatif/fields
interface HomepageNatifFields {
  title: string
  modules: HomepageModule[]
}

export type HomepageModule =
  | { sys: Sys<'algolia'>; fields: AlgoliaFields }
  | { sys: Sys<'business'>; fields: BusinessFields }
  | { sys: Sys<'exclusivity'>; fields: ExclusivityFields }
  | { sys: Sys<'recommendation'>; fields: RecommendationFields }
  | { sys: Sys<'venuesPlaylist'>; fields: VenuesFields }

export interface Image {
  sys: Sys<typeof CONTENT_TYPES.INFORMATION>
  fields: {
    title: string
    description?: string
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

// List available here https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/settings/tags
export type TagId = 'master' | 'usergrandpublic' | 'userunderage'

export interface Tag {
  sys: { type: 'Link'; linkType: 'Tag'; id: TagId }
}

export interface HomepageEntry {
  metadata: { tags: Tag[] }
  sys: Sys<typeof CONTENT_TYPES.HOMEPAGE_NATIF>
  fields: HomepageNatifFields
}
