import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'

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
  const { navigate } = useNavigation()
  const { displayInfosSnackBar } = useSnackBarContext()

  return (errorMessage?: string) => {
    displayInfosSnackBar({
      message: errorMessage ? errorMessage : DEFAULT_ERROR_MESSAGE,
    })
    const configureDefaultScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['default']
    navigate(configureDefaultScreen().screen)
  }
}

export function useDeeplinkUrlHandler() {
  const { navigate } = useNavigation()
  const onError = useOnDeeplinkError()

  return (event: DeeplinkEvent) => {
    try {
      const { routeName, params } = decodeDeeplinkParts(event.url)

      if (!isAllowedRouteTypeGuard(routeName)) {
        throw new Error('Unknown route')
      }

      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION[routeName]
      const { screen, params: screenParams } = configureScreen(params)

      if (!screen) {
        // this error is not displayed to the user but used to trigger the catch branch below
        throw new Error('Unknown screen')
      }

      handleDeeplinkAnalytics(screen, screenParams)
      navigate(screen, screenParams)
    } catch {
      onError(_(t`Le lien est incorrect: `) + event.url)
    }
  }
}
