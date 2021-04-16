import dynamicLinks from '@react-native-firebase/dynamic-links'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { omit } from 'search-params'

import { DeeplinkEvent } from './types'
import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import {
  DEEPLINK_DOMAIN,
  FIREBASE_DYNAMIC_LINK_DOMAIN,
  FIREBASE_DYNAMIC_LINK_PARAMS,
} from './utils'

export const isUniversalLink = (url: string) => url.startsWith(DEEPLINK_DOMAIN)
export const isFirebaseDynamicLink = (url: string) => url.startsWith(FIREBASE_DYNAMIC_LINK_DOMAIN)
export const isFirebaseLongDynamicLink = (url: string) =>
  isFirebaseDynamicLink(url) && url.includes('?link=')

/* For Firebase Dynamic Links with params (exemple /offer?id=234)
 * we must use long dynamic links, and there are not recognized by dynamicLinks().onLink
 * so we handle it manually
 */
export const extractUniversalLinkFromLongFirebaseDynamicLink = (event: DeeplinkEvent): string => {
  const searchParams = event.url.replace(`${FIREBASE_DYNAMIC_LINK_DOMAIN}?`, '')
  const paramsString = omit(searchParams, FIREBASE_DYNAMIC_LINK_PARAMS).querystring
  return paramsString.replace(/^link=/, '')
}

export const resolveHandler = (handleDeeplinkUrl: ReturnType<typeof useDeeplinkUrlHandler>) => (
  event: DeeplinkEvent
) => {
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
}

function useListenUniversalLinks() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    Linking.addEventListener('url', resolveHandler(handleDeeplinkUrl))
    return () => {
      Linking.removeEventListener('url', handleDeeplinkUrl)
    }
  }, [])
}

function useListenDynamicLinks() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDeeplinkUrl)
    return () => {
      unsubscribe()
    }
  }, [])
}

export function useListenDeepLinksEffect() {
  useListenUniversalLinks()
  useListenDynamicLinks()
}
