import { env } from 'libs/environment'

export const DEEPLINK_DOMAIN = `https://${env.UNIVERSAL_LINK}/`
export const FIREBASE_DYNAMIC_LINK_DOMAIN = `https://${env.FIREBASE_DYNAMIC_LINK}/`

// See all params here: https://firebase.google.com/docs/dynamic-links/create-manually
export const FIREBASE_DYNAMIC_LINK_PARAMS = [
  'apn',
  'afl',
  'amv',
  'ibi',
  'ifl',
  'ius',
  'ipfl',
  'ipbi',
  'isi',
  'imv',
  'efr',
  'ofl',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
]
