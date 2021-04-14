import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { handleDeeplinkAnalytics } from './analytics'
import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'
import { isAllowedRouteTypeGuard } from './typeGuard'
import { DeeplinkEvent, DeeplinkParts } from './types'
import { DEEPLINK_DOMAIN } from './utils'

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

export function decodeDeeplinkParts(url: string): DeeplinkParts {
  const route = url.replace(DEEPLINK_DOMAIN, '')

  const routeNameRegexp = /^([a-zA-Z0-9-_]+)/g

  const routeName = route.match(routeNameRegexp)?.[0] || 'unknown'
  const searchParams = route.replace(routeNameRegexp, '')

  const params = parseURI(decodeURI(searchParams))

  return { routeName: routeName, params }
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
    try {
      const { screen, params } = getScreenFromDeeplink(event.url)

      if (!screen) {
        // this error is not displayed to the user but used to trigger the catch branch below
        throw new Error('Unknown screen')
      }

      handleDeeplinkAnalytics(screen, params)
      navigate(screen, params)
    } catch {
      onError(DEFAULT_ERROR_MESSAGE + ' : ' + event.url)
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
