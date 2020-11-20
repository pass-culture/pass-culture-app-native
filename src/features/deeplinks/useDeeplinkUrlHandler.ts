import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { useContext } from 'react'

import { _ } from 'libs/i18n'
import { SnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { isAllowedRouteTypeGuard } from './typeGuard'
import { DeeplinkEvent, DeeplinkParts, DEEPLINK_TO_SCREEN_CONFIGURATION } from './types'
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

  return { routeName, params }
}

export function useOnDeeplinkError() {
  const { navigate } = useNavigation()
  const { displayInfosSnackBar } = useContext(SnackBarContext)

  // TODO: remove this comment when decided about deeplink errors behavior
  // See https://passculture.atlassian.net/browse/PC-5165
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (error: string) => {
    displayInfosSnackBar({
      message: _(t`Le lien est incorrect`),
    })
    navigate(DEEPLINK_TO_SCREEN_CONFIGURATION['default'].screen)
  }
}

export function useDeeplinkUrlHandler() {
  const { navigate } = useNavigation()
  const onError = useOnDeeplinkError()

  return (e: DeeplinkEvent) => {
    try {
      const { routeName, params } = decodeDeeplinkParts(e.url)

      if (!isAllowedRouteTypeGuard(routeName)) {
        throw new Error('Unkwnon route')
      }

      const { screen, paramConverter } = DEEPLINK_TO_SCREEN_CONFIGURATION[routeName]
      if (!screen) {
        // this error is not displayed to the user but used to trigger the catch branch below
        throw new Error('Unkwnon screen')
      }

      // convert uri params to match the screen params' type expectations
      const convertedParams = paramConverter ? paramConverter(params) : params

      navigate(screen, convertedParams)
    } catch (error) {
      onError(error.message)
    }
  }
}
