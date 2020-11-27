import { useEffect } from 'react'
import { Linking } from 'react-native'

import { _ } from 'libs/i18n'

import { useDeeplinkUrlHandler, useOnDeeplinkError } from './useDeeplinkUrlHandler'

export function useListenDeepLinksEffect() {
  const onError = useOnDeeplinkError()
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    Linking.getInitialURL()
      .catch(onError)
      .then((url) => {
        if (url) {
          handleDeeplinkUrl({ url })
        } else {
          onError()
        }
      })
    Linking.addEventListener('url', handleDeeplinkUrl)
    return () => Linking.removeEventListener('url', handleDeeplinkUrl)
  }, [])
}
