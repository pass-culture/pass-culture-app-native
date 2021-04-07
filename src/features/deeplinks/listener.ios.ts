import dynamicLinks from '@react-native-firebase/dynamic-links'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'

export function useListenDeepLinksEffect() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    // Universal links
    Linking.addEventListener('url', handleDeeplinkUrl)
    // Firebase Dynamic links
    const unsubscribe = dynamicLinks().onLink(handleDeeplinkUrl)
    return () => {
      Linking.removeEventListener('url', handleDeeplinkUrl)
      unsubscribe()
    }
  }, [])

  return null
}
