import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'

import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { handleDeeplinkAnalytics } from './analytics'
import { getScreenFromDeeplink } from './getScreenFromDeeplink'
import { DeeplinkEvent } from './types'

const DEFAULT_ERROR_MESSAGE = t`Le lien est incorrect`

export function useOnDeeplinkError() {
  const { showInfoSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  return (errorMessage?: string) => {
    showInfoSnackBar({
      message: errorMessage ? errorMessage : DEFAULT_ERROR_MESSAGE,
      timeout: SNACK_BAR_TIME_OUT,
    })
    navigate(...homeNavigateConfig)
  }
}

export function useDeeplinkUrlHandler() {
  const onError = useOnDeeplinkError()
  const { navigate } = useNavigation<UseNavigationType>()
  return (event: DeeplinkEvent) => {
    const url = unescape(event.url)
    try {
      const { screen, params } = getScreenFromDeeplink(url)
      handleDeeplinkAnalytics(screen, params)
      navigate(screen, params)
    } catch {
      onError(DEFAULT_ERROR_MESSAGE + ' : ' + url)
    }
  }
}
