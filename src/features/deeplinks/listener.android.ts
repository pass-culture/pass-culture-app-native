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
        if (url === null) {
          // Android/iOS can return null when opening the app from certains places
          // in this case, it's not en error, just ignore it.
          return
        }

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
