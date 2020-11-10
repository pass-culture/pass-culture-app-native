import { useEffect } from 'react'
import { Linking } from 'react-native'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'

export function useListenDeepLinksEffect() {
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    Linking.addEventListener('url', handleDeeplinkUrl)
    return () => Linking.removeEventListener('url', handleDeeplinkUrl)
  }, [])
}
