import { OFFER } from './offer'
import { VENUE } from './venue'

export const ENTITY_MAP = {
  offre: OFFER,
  lieu: VENUE,
}

export const ENTITY_METAS_CONFIG_MAP = {
  offre: OFFER.METAS_CONFIG,
  lieu: VENUE.METAS_CONFIG,
}

export type NestedMetadata =
  | string
  | number
  | boolean
  | string[]
  | { [key: string]: NestedMetadata }
export type Metadata = Record<string, NestedMetadata>

export type OfferData = {
  id: number
  name: string
  subcategoryId: string
  metadata: Metadata
  description?: string | null
  image?: {
    url: string
  } | null
  extraData?: {
    musicSubType?: string | null
    musicType?: string | null
    showSubType?: string | null
    showType?: string | null
  } | null
}

export type VenueData = {
  id: number
  name: string
  publicName?: string | null
  description?: string | null
  bannerUrl?: string | null
  venueTypeCode?: string | null
  bannerMeta?: { image_credit?: string | null } | null
}

export type EntityKeys = keyof typeof ENTITY_MAP

export type EntityType<T> = {
  API_MODEL_NAME: string
  METAS_CONFIG: {
    title: (entity: T) => string
    metaTitle: (entity: T) => string
    metaDescription: (entity: T) => string
    ['og:url']: (href: string, subPath: string) => string
    ['og:title']: (entity: T) => string
    ['og:description']: (entity: T) => string
    ['og:image']: (entity: T) => string
    ['og:image:alt']: (entity: T) => string
    ['twitter:card']: () => TwitterCard
    ['twitter:url']: (entity: T, href: string, subPath: string) => string
    ['twitter:title']: (entity: T) => string
    ['twitter:description']: (entity: T) => string
    ['twitter:image']: (entity: T) => string
    ['twitter:image:alt']: (entity: T) => string
    ['twitter:app:url:iphone']: (entity: T, href: string, subPath: string) => string
    ['twitter:app:url:ipad']: (entity: T, href: string, subPath: string) => string
    ['twitter:app:url:googleplay']: (entity: T, href: string, subPath: string) => string
    ['al:ios:url']: (entity: T, href: string, subPath: string) => string
    ['al:android:url']: (entity: T, href: string, subPath: string) => string
  }
}

export enum TwitterCard {
  app = 'app',
  summary = 'summary',
  summaryLargeImage = 'summary_large_image',
}

export type MetaConfig = Record<
  string,
  {
    data: string
    regEx: RegExp
  }
>
