import { DeepLinksToScreenConfiguration } from 'features/deeplinks/types'
import { env } from 'libs/environment'

export const DEEPLINK_DOMAIN = `https://${env.UNIVERSAL_LINK}/`
export const FIREBASE_DYNAMIC_LINK_DOMAIN = `https://${env.FIREBASE_DYNAMIC_LINK}/`

/**
 * @param ignoreMiddlePage S'il est défini sur true («1»), ignorez la page d'aperçu de
 * l'application lorsque le lien dynamique est ouvert et redirigez-vous plutôt vers
 * l'application ou le magasin. La page d'aperçu de l'application (activée par défaut)
 * peut envoyer les utilisateurs de manière plus fiable vers la destination la plus
 * appropriée lorsqu'ils ouvrent des liens dynamiques dans les applications; cependant,
 * si vous vous attendez à ce qu'un lien dynamique soit ouvert uniquement dans les applications
 * qui peuvent ouvrir des liens dynamiques de manière fiable sans cette page, vous pouvez le
 * désactiver avec ce paramètre. Ce paramètre affectera le comportement du lien dynamique
 * uniquement sur iOS.
 * @see https://firebase.google.com/docs/dynamic-links/create-manually
 */
export function getLongDynamicLinkURI(ignoreMiddlePage = true) {
  return `apn=${env.ANDROID_APP_ID}&isi=${env.IOS_APP_STORE_ID}&ibi=${env.IOS_APP_ID}&efr=${Number(
    ignoreMiddlePage
  )}`
}

/**
 * @param screen The deeplink targetted screen
 * @param uri the params to forward to the targetted screen
 */
export function generateLongFirebaseDynamicLink(
  screen: keyof DeepLinksToScreenConfiguration,
  uri: string
) {
  return `${FIREBASE_DYNAMIC_LINK_DOMAIN}?link=${DEEPLINK_DOMAIN}${screen}?${uri}&${getLongDynamicLinkURI()}`
}

/**
 * For all params
 * @see https://firebase.google.com/docs/dynamic-links/create-manually
 */
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
