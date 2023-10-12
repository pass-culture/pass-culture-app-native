import { env } from '../../libs/environment/env'

import { EntityType, TwitterCard } from './types'

const { DEEPLINK_PROTOCOL } = env

export const VENUE: EntityType = {
  API_MODEL_NAME: 'venue',
  METAS_CONFIG: {
    metaTitle(entity: Record<string, unknown>) {
      return (entity.publicName || entity.name) as string
    },
    metaDescription(entity: Record<string, unknown>) {
      return entity.description as string
    },
    ['og:url'](href: string, subPath: string) {
      return `${href}${subPath}`
    },
    ['og:title'](entity: Record<string, unknown>) {
      return (entity.publicName || entity.name) as string
    },
    ['og:description'](entity: Record<string, unknown>) {
      return entity.description as string
    },
    ['og:image'](entity: Record<string, unknown>) {
      return entity.bannerUrl as string
    },
    ['og:image:alt'](entity: Record<string, unknown>) {
      return entity.description as string
    },
    ['twitter:card']() {
      return TwitterCard.summaryLargeImage
    },
    ['twitter:url'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${href}${subPath}`
    },
    ['twitter:title'](entity: Record<string, unknown>) {
      return (entity.publicName || entity.name) as string
    },
    ['twitter:description'](entity: Record<string, unknown>) {
      return entity.description as string
    },
    ['twitter:image'](entity: Record<string, unknown>) {
      return entity.bannerUrl as string
    },
    ['twitter:image:alt'](entity: Record<string, unknown>) {
      return ((entity.bannerMeta as Record<string, string>)?.image_credit ||
        entity.description) as string
    },
    ['twitter:app:url:iphone'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['twitter:app:url:ipad'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['twitter:app:url:googleplay'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['al:ios:url'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['al:android:url'](entity: Record<string, unknown>, href: string, subPath: string) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
  },
}
