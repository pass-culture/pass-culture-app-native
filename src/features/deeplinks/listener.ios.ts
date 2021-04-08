import dynamicLinks from '@react-native-firebase/dynamic-links'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { omit } from 'search-params'

import { DeeplinkEvent } from './types'
import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { FIREBASE_DYNAMIC_LINK_DOMAIN, FIREBASE_DYNAMIC_LINK_PARAMS } from './utils'

const isFirebaseDynamicLinks = (url: string) => url.startsWith(FIREBASE_DYNAMIC_LINK_DOMAIN)

/* For Firebase Dynamic Links with params (exemple /offer?id=234)
 * we must use long dynamic links, and there are not recognized by dynamicLinks().onLink
 * so we handle it manually
 */
const convertLongDynamicLinkToUniversalLink = (event: DeeplinkEvent): string => {
  const searchParams = event.url.replace(`${FIREBASE_DYNAMIC_LINK_DOMAIN}?`, '')
  const paramsString = omit(searchParams, FIREBASE_DYNAMIC_LINK_PARAMS).querystring
  return paramsString.replace(/^link=/, '')
}

export function useListenDeepLinksEffect() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  const handleUniversalLinks = (event: DeeplinkEvent) => {
    // Firebase Dynamic Links are handled with dynamicLinks().onLink
    if (isFirebaseDynamicLinks(event.url)) {
      handleDeeplinkUrl({ url: convertLongDynamicLinkToUniversalLink(event) })
    } else {
      handleDeeplinkUrl(event)
    }
  }

  const handleDynamicLink = (event: DeeplinkEvent) => {
    handleDeeplinkUrl(event)
  }

  useEffect(() => {
    // Universal links
    Linking.addEventListener('url', handleUniversalLinks)
    // Firebase Dynamic links
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
    return () => {
      Linking.removeEventListener('url', handleDeeplinkUrl)
      unsubscribe()
    }
  }, [])

  return null
}
