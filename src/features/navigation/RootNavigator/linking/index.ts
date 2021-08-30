import { t } from '@lingui/macro'
import { getPathFromState, getStateFromPath, LinkingOptions } from '@react-navigation/native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { WEBAPP_V2_URL } from 'libs/environment'

import { routes } from '../routes'

import { getInitialURL } from './getInitialUrl'
import { subscribe } from './subscribe'

export const linking: LinkingOptions = {
  prefixes: [WEBAPP_V2_URL, WEBAPP_NATIVE_REDIRECTION_URL, 'passculture://'],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  config: {
    screens: {
      ...routes.reduce(
        (route, currentRoute) => ({
          ...route,
          [currentRoute.name]: currentRoute.pathConfig || currentRoute.path,
        }),
        {}
      ),
    },
  },
  getStateFromPath: (path, config) => {
    const state = getStateFromPath(path, config)
    if (state && state.routes) {
      const screenName = state.routes[0].name as ScreenNames
      // TO DO web : use a unique screen for DeeplinkPath.NEXT_BENEFECIARY_STEP path (and not Login)
      if (screenName === 'NextBeneficiaryStep') {
        const name: ScreenNames = 'Login'
        return {
          ...state,
          routes: [{ key: 'login-1', name, params: { followScreen: 'NextBeneficiaryStep' } }],
        }
      }
    }
    return state
  },
  getPathFromState: (state, config) => {
    const path = getPathFromState(state, config)
    // We cannot customize the 404 screen path with react-navigation, as it takes the screen names instead.
    // See this issue : https://github.com/react-navigation/react-navigation/issues/9102
    const pageNotFoundScreenName: ScreenNames = 'PageNotFound'
    if (path.includes(pageNotFoundScreenName)) {
      return t`page-introuvable`
    }
    return path
  },
}
