import { omit } from 'search-params'

import { env } from 'libs/environment'

import { DeeplinkEvent } from './types'

export const WEBAPP_NATIVE_REDIRECTION_URL = `https://${env.WEBAPP_NATIVE_REDIRECTION_DOMAIN}`
export const FIREBASE_DYNAMIC_LINK_URL = `https://${env.FIREBASE_DYNAMIC_LINK_DOMAIN}`

export const isUniversalLink = (url: string) => url.startsWith(WEBAPP_NATIVE_REDIRECTION_URL)
export const isFirebaseDynamicLink = (url: string) => url.startsWith(FIREBASE_DYNAMIC_LINK_URL)
export const isFirebaseLongDynamicLink = (url: string) =>
  isFirebaseDynamicLink(url) && url.includes('?link=')

/* For Firebase Dynamic Links with params (exemple /offer?id=234)
 * we must use long dynamic links, and there are not recognized by dynamicLinks().onLink
 * so we handle it manually
 */
export const extractUniversalLinkFromLongFirebaseDynamicLink = (event: DeeplinkEvent): string => {
  const searchParams = event.url.replace(`${FIREBASE_DYNAMIC_LINK_URL}/?`, '')
  const paramsString = omit(searchParams, FIREBASE_DYNAMIC_LINK_PARAMS).querystring
  return paramsString.replace(/^link=/, '')
}

export const resolveHandler = (
  handleDeeplinkUrl: (event: DeeplinkEvent) => void,
  listenShortLinks?: boolean // This option should not be passed when using resolveHandler into the ios listener
) => (event: DeeplinkEvent) => {
  if (isUniversalLink(event.url)) {
    // Universal links: https://app.passculture-{env}.beta.gouv.fr/<routeName>
    return handleDeeplinkUrl(event)
  }

  // Long Firebase Dynamic Links: https://passcultureapp{env}.page.link/?link=https://app.passculture-{env}.beta.gouv.fr/<routeName>?param=214906&apn=app.passculture.testing&isi=1557887412&ibi=app.passculture.test&efr=1
  if (isFirebaseLongDynamicLink(event.url)) {
    return handleDeeplinkUrl({ url: extractUniversalLinkFromLongFirebaseDynamicLink(event) })
  }

  // Short Firebase Dynamic Links: https://passcultureapp{env}.page.link/<routeName>
  // => handled with dynamicLinks().onLink
  if (listenShortLinks) {
    handleDeeplinkUrl({ url: event.url.replace(FIREBASE_DYNAMIC_LINK_URL, '') })
  }
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
