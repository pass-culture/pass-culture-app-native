import { useNavigation } from '@react-navigation/native'

import { env } from 'libs/environment'

import {
  AllowedDeeplinkRoutes,
  DeeplinkEvent,
  DeeplinkParts,
  deeplinkToScreenConfiguration,
} from './types'

export function formatIosDeeplinkDomain() {
  return `${env.URL_PREFIX}://${env.IOS_APP_ID}/`
}

export function formatAndroidDeeplinkDomain() {
  return `${env.URL_PREFIX}://${env.ANDROID_APP_ID}/`
}

export function decodeDeeplinkParts(url: string): DeeplinkParts {
  let route = url.replace(formatIosDeeplinkDomain(), '')
  route = route.replace(formatAndroidDeeplinkDomain(), '')

  const [routeName, searchParams] = route.split('?') as [AllowedDeeplinkRoutes, string]
  const params = searchParams
    ? JSON.parse(
        '{"' +
          decodeURI(searchParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
          '"}'
      )
    : {}

  return { routeName, params }
}

export function useOnDeeplinkError() {
  const { navigate } = useNavigation()

  // TODO: remove this comment when decided about deeplink errors behavior
  // See https://passculture.atlassian.net/browse/PC-5165
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (error: string) => {
    // shall we navigate to oops 404 ?
    navigate(deeplinkToScreenConfiguration['default'].screen)
  }
}

export function useDeeplinkUrlHandler() {
  const { navigate } = useNavigation()
  const onError = useOnDeeplinkError()

  return (e: DeeplinkEvent) => {
    try {
      const { routeName, params } = decodeDeeplinkParts(e.url)

      const { screen, paramConverter } = deeplinkToScreenConfiguration[routeName]
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
