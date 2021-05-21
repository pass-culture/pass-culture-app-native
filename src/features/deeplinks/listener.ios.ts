import dynamicLinks from '@react-native-firebase/dynamic-links'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { resolveHandler } from './utils'

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
