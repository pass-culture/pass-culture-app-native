import { env } from '../../libs/environment/serverEnv'

import { EntityType, TwitterCard, VenueData } from './types'

const { DEEPLINK_PROTOCOL } = env

export const VENUE: EntityType<VenueData> = {
  API_MODEL_NAME: 'venue',
  METAS_CONFIG: {
    title(entity) {
      return entity.publicName || entity.name
    },
    metaTitle(entity) {
      return entity.publicName || entity.name
    },
    metaDescription(entity) {
      return entity.description as string
    },
    metaKeywords() {
      return ''
    },
    ['og:url'](href, subPath) {
      return `${href}${subPath}`
    },
    ['og:title'](entity) {
      return entity.publicName || entity.name
    },
    ['og:description'](entity) {
      return entity.description as string
    },
    ['og:image'](entity) {
      return entity.bannerUrl as string
    },
    ['og:image:alt'](entity) {
      return entity.description as string
    },
    ['twitter:card']() {
      return TwitterCard.summaryLargeImage
    },
    ['twitter:url'](entity, href, subPath) {
      return `${href}${subPath}`
    },
    ['twitter:title'](entity) {
      return entity.publicName || entity.name
    },
    ['twitter:description'](entity) {
      return entity.description as string
    },
    ['twitter:image'](entity) {
      return entity.bannerUrl as string
    },
    ['twitter:image:alt'](entity) {
      return (entity.bannerMeta?.image_credit || entity.description) as string
    },
    ['twitter:app:url:iphone'](entity, href, subPath) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['twitter:app:url:ipad'](entity, href, subPath) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['twitter:app:url:googleplay'](entity, href, subPath) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['al:ios:url'](entity, href, subPath) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
    ['al:android:url'](entity, href, subPath) {
      return `${DEEPLINK_PROTOCOL}${href}${subPath}`
    },
  },
}
