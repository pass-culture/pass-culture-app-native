import { env } from '../../libs/environment/serverEnv'

import { EntityType, OfferData, TwitterCard } from './types'

const { DEEPLINK_PROTOCOL } = env

export const OFFER: EntityType<OfferData> = {
  API_MODEL_NAME: 'offer',
  METAS_CONFIG: {
    title(entity) {
      return entity.name
    },
    metaTitle(entity) {
      return entity.name
    },
    metaDescription(entity) {
      return entity.description as string
    },
    metaKeywords(entity) {
      const extraData = entity.extraData || {}
      const keywords = [
        entity.subcategoryId.replaceAll('_', ' '),
        extraData.musicType,
        extraData.musicSubType,
        extraData.showType,
        extraData.showSubType,
      ].filter((keyword) => !!keyword)

      return keywords.join(', ')
    },
    ['og:url'](href, subPath) {
      return `${href}${subPath}`
    },
    ['og:title'](entity) {
      return entity.name
    },
    ['og:description'](entity) {
      return entity.description as string
    },
    ['og:image'](entity) {
      return entity.image?.url as string
    },
    ['og:image:alt'](entity) {
      return entity.name
    },
    ['twitter:card']() {
      return TwitterCard.summary
    },
    ['twitter:url'](entity, href, subPath) {
      return `${href}${subPath}`
    },
    ['twitter:title'](entity) {
      return entity.name
    },
    ['twitter:description'](entity) {
      return entity.description as string
    },
    ['twitter:image'](entity) {
      return entity.image?.url as string
    },
    ['twitter:image:alt'](entity) {
      return entity.name
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
