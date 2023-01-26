import { env } from 'libs/environment'

export const FIREBASE_DYNAMIC_LINK_URL = `https://${env.FIREBASE_DYNAMIC_LINK_DOMAIN}`

/**
 * @see https://firebase.google.com/docs/dynamic-links/create-manually
 */
export function getLongDynamicLinkURI() {
  return `apn=${env.ANDROID_APP_ID}&isi=${env.IOS_APP_STORE_ID}&ibi=${env.IOS_APP_ID}&efr=1`
}

/**
 * @see https://firebase.google.com/docs/dynamic-links/create-manually
 * @param deepLink The deeplink targeted screen
 * @param deepLinkParams Firebase additional params https://firebase.google.com/docs/dynamic-links/create-manually#parameters or ofl URL if a string.
 */
export function generateLongFirebaseDynamicLink(
  deepLink: string,
  deepLinkParams?: Record<string, unknown | string>
) {
  let params = ''
  if (deepLinkParams) {
    Object.entries(deepLinkParams).forEach(([key, value]) => {
      params += `&${key}=${value}`
    })
  }
  return `${FIREBASE_DYNAMIC_LINK_URL}/?link=${encodeURIComponent(
    deepLink
  )}&${getLongDynamicLinkURI()}${params}`
}
