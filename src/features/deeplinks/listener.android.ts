import { t } from '@lingui/macro'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { _ } from 'libs/i18n'

import { useDeeplinkUrlHandler, useOnDeeplinkError } from './useDeeplinkUrlHandler'

export function useListenDeepLinksEffect() {
  const onError = useOnDeeplinkError()
  const handleDeeplinkUrl = useDeeplinkUrlHandler()

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          handleDeeplinkUrl({ url })
        } else if (url !== null) {
          onError(_(t`Impossible d'ouvrir le lien: `) + url)
        }
      })
      .catch(() => onError(_(t`Impossible d'ouvrir le lien`)))
    Linking.addEventListener('url', handleDeeplinkUrl)
    return () => Linking.removeEventListener('url', handleDeeplinkUrl)
  }, [])
}
