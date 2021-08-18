import { getStateFromPath } from '@react-navigation/native'

import { DeeplinkPath } from 'features/deeplinks/enums'
import { ScreenNames } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { WEBAPP_V2_URL } from 'libs/environment'

import { DeeplinkParts } from './types'
import { WEBAPP_NATIVE_REDIRECTION_URL } from './utils'

const ROUTE_NAME_REGEX = /^([a-zA-Z0-9-_]+)/g

export function getScreenFromDeeplink(url: string): DeeplinkParts {
  // We have to try 2 replaces since we support both pre and post-decliweb versions
  const pathWithQueryString = url
    .replace(`${WEBAPP_NATIVE_REDIRECTION_URL}/`, '')
    .replace(`${WEBAPP_V2_URL}/`, '')

  // TO DO web : use a unique screen for /id-check path (and not Login)
  // When done, the "decoding" can be done with only `getStateFromPath`
  const path = pathWithQueryString.match(ROUTE_NAME_REGEX)?.[0]
  if (path === DeeplinkPath.NEXT_BENEFECIARY_STEP) {
    const screen = 'Login'
    const parser = screenParamsParser[screen]
    return { screen, params: { followScreen: parser.followScreen('NextBeneficiaryStep') } }
  }

  const navigationState = getStateFromPath(pathWithQueryString, linking.config)
  if (!navigationState?.routes || navigationState.routes.length !== 1) {
    throw new Error('Unknown route')
  }
  const route = navigationState.routes[0]
  return { screen: route.name as ScreenNames, params: route.params as Record<string, string> }
}
