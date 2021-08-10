import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { handleDeeplinkAnalytics } from './analytics'
import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'
import { isAllowedRouteTypeGuard } from './typeGuard'
import { DeeplinkEvent, DeeplinkParts } from './types'
import { WEBAPP_NATIVE_REDIRECTION_URL } from './utils'

export function sanitizeURI(uri: string) {
  return (
    uri
      // in this order ...
      .trim()
      .replace(/^\/+|\/+$/g, '') // removes external '/'
      .replace(/^\?+/g, '') // removes initial '?'
      .replace(/^&+|&+$/g, '') // removes external '&'
  )
}

export function parseURI(uri: string) {
  const sanitizedUri = sanitizeURI(uri)
  const parameterFields =
    sanitizedUri.split('&').reduce((accumulator, field) => {
      accumulator = accumulator || {}
      const index = field.indexOf('=')
      if (index === -1) {
        accumulator[field] = '' // empty parameter
      } else {
        const key = field.slice(0, index)
        const value = field.slice(index + 1)
        accumulator[key] = value
      }
      return accumulator
    }, <Record<string, string> | null>{}) || {}

  return parameterFields
}

const ROUTE_NAME_REGEX = /^([a-zA-Z0-9-_]+)/g

export function decodeDeeplinkParts(url: string): DeeplinkParts {
  const pathWithQueryString = url.replace(`${WEBAPP_NATIVE_REDIRECTION_URL}/`, '')
  const path = pathWithQueryString.match(ROUTE_NAME_REGEX)?.[0] || 'unknown'
  const queryString = pathWithQueryString.replace(ROUTE_NAME_REGEX, '')
  return { routeName: path, params: parseURI(decodeURI(queryString)) }
}

const DEFAULT_ERROR_MESSAGE = t`Le lien est incorrect`

export function useOnDeeplinkError() {
  const { showInfoSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()

  return (errorMessage?: string) => {
    showInfoSnackBar({
      message: errorMessage ? errorMessage : DEFAULT_ERROR_MESSAGE,
      timeout: SNACK_BAR_TIME_OUT,
    })
    const { screen, params } = DEEPLINK_TO_SCREEN_CONFIGURATION['default']()
    navigate(screen, params)
  }
}

export function useDeeplinkUrlHandler() {
  const onError = useOnDeeplinkError()
  const { navigate } = useNavigation<UseNavigationType>()

  return (event: DeeplinkEvent) => {
    const url = unescape(event.url)
    try {
      const screenConfig = getScreenFromDeeplink(url)
      const { screen, params } = screenConfig

      if (!screen) {
        // this error is not displayed to the user but used to trigger the catch branch below
        throw new Error('Unknown screen')
      }

      handleDeeplinkAnalytics(screen, params)
      navigate(screen, params)
    } catch {
      onError(DEFAULT_ERROR_MESSAGE + ' : ' + url)
    }
  }
}

export function getScreenFromDeeplink(url: string) {
  const { routeName, params } = decodeDeeplinkParts(url)

  if (!isAllowedRouteTypeGuard(routeName)) {
    throw new Error('Unknown route')
  }

  const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION[routeName]
  return configureScreen(params)
}
