import dynamicLinks from '@react-native-firebase/dynamic-links'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { DeeplinkEvent } from './types'
import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { FIREBASE_DYNAMIC_LINK_DOMAIN } from './utils'

const isFirebaseDynamicLinks = (url: string) => url.startsWith(FIREBASE_DYNAMIC_LINK_DOMAIN)

export function useListenDeepLinksEffect() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  const handleUniversalLinks = (event: DeeplinkEvent) => {
    // Firebase Dynamic Links are handled with dynamicLinks().onLink
    if (isFirebaseDynamicLinks(event.url)) return
    handleDeeplinkUrl(event)
  }

  useEffect(() => {
    // Universal links
    Linking.addEventListener('url', handleUniversalLinks)
    // Firebase Dynamic links
    const unsubscribe = dynamicLinks().onLink(handleDeeplinkUrl)
    return () => {
      Linking.removeEventListener('url', handleDeeplinkUrl)
      unsubscribe()
    }
  }, [])

  return null
}
