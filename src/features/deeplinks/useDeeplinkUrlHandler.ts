import { t } from '@lingui/macro'

import { navigationRef } from 'features/navigation/navigationRef'
import { _ } from 'libs/i18n'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { handleDeeplinkAnalytics } from './analytics'
import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'
import { isAllowedRouteTypeGuard } from './typeGuard'
import { DeeplinkEvent, DeeplinkParts } from './types'
import { DEEPLINK_DOMAIN } from './utils'

export function decodeDeeplinkParts(url: string): DeeplinkParts {
  const route = url.replace(DEEPLINK_DOMAIN, '')

  const [routeName, searchParams] = route.split('?')
  const params = searchParams
    ? JSON.parse(
        `{"${decodeURI(searchParams)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')}"}`
      )
    : {}

  return { routeName: routeName.replace(/\/$/, ''), params }
}

const DEFAULT_ERROR_MESSAGE = _(t`Le lien est incorrect`)

export function useOnDeeplinkError() {
  const { displayInfosSnackBar } = useSnackBarContext()

  return (errorMessage?: string) => {
    displayInfosSnackBar({
      message: errorMessage ? errorMessage : DEFAULT_ERROR_MESSAGE,
    })
    const { screen, params } = DEEPLINK_TO_SCREEN_CONFIGURATION['default']()
    navigationRef.current?.navigate(screen, params)
  }
}

export function useDeeplinkUrlHandler() {
  const onError = useOnDeeplinkError()

  return (event: DeeplinkEvent) => {
    try {
      const { screen, params } = getScreenFromDeeplink(event.url)

      if (!screen) {
        // this error is not displayed to the user but used to trigger the catch branch below
        throw new Error('Unknown screen')
      }

      handleDeeplinkAnalytics(screen, params)
      navigationRef.current?.navigate(screen, params)
    } catch {
      onError(DEFAULT_ERROR_MESSAGE + ' : ' + event.url)
    }
  }
}

function getScreenFromDeeplink(url: string) {
  const { routeName, params } = decodeDeeplinkParts(url)

  if (!isAllowedRouteTypeGuard(routeName)) {
    throw new Error('Unknown route')
  }

  const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION[routeName]
  return configureScreen(params)
}
