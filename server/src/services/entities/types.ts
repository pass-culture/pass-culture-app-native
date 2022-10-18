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

export type EntityKeys = keyof typeof ENTITY_MAP

export type EntityType = {
  API_MODEL_NAME: string
  METAS_CONFIG: {
    title: (entity: Record<string, unknown>) => string
    description: (entity: Record<string, unknown>) => string
    ['og:url']: (href: string, subPath: string) => string
    ['og:title']: (entity: Record<string, unknown>) => string
    ['og:description']: (entity: Record<string, unknown>) => string
    ['og:image']: (entity: Record<string, unknown>) => string
    ['og:image:alt']: (entity: Record<string, unknown>) => string
    ['twitter:card']: () => TwitterCard
    ['twitter:url']: (entity: Record<string, unknown>, href: string, subPath: string) => string
    ['twitter:title']: (entity: Record<string, unknown>) => string
    ['twitter:description']: (entity: Record<string, unknown>) => string
    ['twitter:image']: (entity: Record<string, unknown>) => string
    ['twitter:image:alt']: (entity: Record<string, unknown>) => string
    ['twitter:app:url:iphone']: (
      entity: Record<string, unknown>,
      href: string,
      subPath: string
    ) => string
    ['twitter:app:url:ipad']: (
      entity: Record<string, unknown>,
      href: string,
      subPath: string
    ) => string
    ['twitter:app:url:googleplay']: (
      entity: Record<string, unknown>,
      href: string,
      subPath: string
    ) => string
    ['al:ios:url']: (entity: Record<string, unknown>, href: string, subPath: string) => string
    ['al:android:url']: (entity: Record<string, unknown>, href: string, subPath: string) => string
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
