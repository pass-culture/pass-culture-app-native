import { t } from '@lingui/macro'
import { getPathFromState, getStateFromPath, LinkingOptions } from '@react-navigation/native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { DeeplinkPath } from 'features/deeplinks/enums'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { WEBAPP_V2_URL } from 'libs/environment'

import { routes } from './routes'

export const linking: LinkingOptions = {
  prefixes: [WEBAPP_V2_URL, WEBAPP_NATIVE_REDIRECTION_URL, 'passculture://'],
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
    // TO DO web : use a unique screen for DeeplinkPath.NEXT_BENEFECIARY_STEP path (and not Login)
    if (state && path.includes(DeeplinkPath.NEXT_BENEFECIARY_STEP)) {
      const name: ScreenNames = 'Login'
      // @ts-expect-error : `routeNames` is a read-only property
      state.routeNames = [name]
      // @ts-expect-error : `routes` is a read-only property
      state.routes = [{ key: 'login-1', name, params: { followScreen: 'NextBeneficiaryStep' } }]
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
