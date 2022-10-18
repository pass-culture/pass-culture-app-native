import { encode } from 'html-entities'

import { env } from '../libs/environment/env'
import { apiClient } from '../services/apiClient'
import { ENTITY_METAS_CONFIG_MAP, EntityKeys, MetaConfig } from '../services/entities/types'

const { APP_PUBLIC_URL, ORGANIZATION_PREFIX } = env

const { href } = new URL(APP_PUBLIC_URL)

const REGEX = {
  title: /<meta\s+(name)="(title)"\s+content="([^"]*)"\s*\/?>/g,
  description: /<meta\s+(name)="(description)"\s+content="([^"]*)"\s*\/?>/g,
  ['og:url']: /<meta\s+(property)="(og:url)"\s+content="([^"]*)"\s*\/?>/g,
  ['og:title']: /<meta\s+(property)="(og:title)"\s+content="([^"]*)"\s*\/?>/g,
  ['og:description']: /<meta\s+(property)="(og:description)"\s+content="([^"]*)"\s*\/?>/g,
  ['og:image']: /<meta\s+(property)="(og:image)"\s+content="([^"]*)"\s*\/?>/g,
  ['og:image:alt']: /<meta\s+(property)="(og:image:alt)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:card']: /<meta\s+(name)="(twitter:card)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:url']: /<meta\s+(name)="(twitter:url)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:title']: /<meta\s+(name)="(twitter:title)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:description']: /<meta\s+(name)="(twitter:description)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:image']: /<meta\s+(name)="(twitter:image)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:image:alt']: /<meta\s+(name)="(twitter:image:alt)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:app:url:iphone']:
    /<meta\s+(name)="(twitter:app:url:iphone)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:app:url:ipad']: /<meta\s+(name)="(twitter:app:url:ipad)"\s+content="([^"]*)"\s*\/?>/g,
  ['twitter:app:url:googleplay']:
    /<meta\s+(name)="(twitter:app:url:googleplay)"\s+content="([^"]*)"\s*\/?>/g,
  ['al:ios:url']: /<meta\s+(name)="(al:ios:url)"\s+content="([^"]*)"\s*\/?>/g,
  ['al:android:url']: /<meta\s+(name)="(al:android:url)"\s+content="([^"]*)"\s*\/?>/g,
}

export function addOrganizationPrefix(title: string) {
  return `${ORGANIZATION_PREFIX} | ${title}`
}

export async function replaceHtmlMetas(
  html: string,
  endpoint: string,
  type: EntityKeys,
  entityId: number
) {
  const entity = await apiClient(type, entityId)
  const subPath = endpoint.slice(1)
  const METAS_CONFIG = ENTITY_METAS_CONFIG_MAP[type]
  const metaConfig: MetaConfig = {
    title: {
      data: addOrganizationPrefix(METAS_CONFIG.title(entity)),
      regEx: REGEX.title,
    },
    description: {
      data: METAS_CONFIG.description(entity),
      regEx: REGEX.description,
    },
    ['og:url']: {
      data: METAS_CONFIG['og:url'](href, subPath),
      regEx: REGEX['og:url'],
    },
    ['og:title']: {
      data: addOrganizationPrefix(METAS_CONFIG['og:title'](entity)),
      regEx: REGEX['og:title'],
    },
    ['og:description']: {
      data: METAS_CONFIG['og:description'](entity),
      regEx: REGEX['og:description'],
    },
    ['og:image']: {
      data: METAS_CONFIG['og:image'](entity),
      regEx: REGEX['og:image'],
    },
    ['og:image:alt']: {
      data: METAS_CONFIG['og:image:alt'](entity),
      regEx: REGEX['og:image:alt'],
    },
    ['twitter:card']: {
      data: METAS_CONFIG['twitter:card'](),
      regEx: REGEX['twitter:card'],
    },
    ['twitter:url']: {
      data: METAS_CONFIG['twitter:url'](entity, href, subPath),
      regEx: REGEX['twitter:url'],
    },
    ['twitter:title']: {
      data: addOrganizationPrefix(METAS_CONFIG['twitter:title'](entity)),
      regEx: REGEX['twitter:title'],
    },
    ['twitter:description']: {
      data: METAS_CONFIG['twitter:description'](entity),
      regEx: REGEX['twitter:description'],
    },
    ['twitter:image']: {
      data: METAS_CONFIG['twitter:image'](entity),
      regEx: REGEX['twitter:image'],
    },
    ['twitter:image:alt']: {
      data: METAS_CONFIG['twitter:image:alt'](entity),
      regEx: REGEX['twitter:image:alt'],
    },
    ['twitter:app:url:iphone']: {
      data: METAS_CONFIG['twitter:app:url:iphone'](entity, href, subPath),
      regEx: REGEX['twitter:app:url:iphone'],
    },
    ['twitter:app:url:ipad']: {
      data: METAS_CONFIG['twitter:app:url:ipad'](entity, href, subPath),
      regEx: REGEX['twitter:app:url:ipad'],
    },
    ['twitter:app:url:googleplay']: {
      data: METAS_CONFIG['twitter:app:url:googleplay'](entity, href, subPath),
      regEx: REGEX['twitter:app:url:googleplay'],
    },
    ['al:ios:url']: {
      data: METAS_CONFIG['al:ios:url'](entity, href, subPath),
      regEx: REGEX['al:ios:url'],
    },
    ['al:android:url']: {
      data: METAS_CONFIG['al:android:url'](entity, href, subPath),
      regEx: REGEX['al:android:url'],
    },
  }

  Object.values(metaConfig).forEach(({ regEx, data }) => {
    if (data) {
      html = html.replace(regEx, `<meta $1="$2" content="${encode(data)}" />`)
    }
  })

  return html
}
