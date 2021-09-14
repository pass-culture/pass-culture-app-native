import { LinkingOptions } from '@react-navigation/native'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { WEBAPP_V2_URL } from 'libs/environment'
import { RequireField } from 'libs/typesUtils/typeHelpers'

import { routes } from '../routes'

import { getInitialURL } from './getInitialUrl'
import { customGetPathFromState } from './getPathFromState'
import { customGetStateFromPath } from './getStateFromPath'
import { subscribe } from './subscribe'

export const linking: RequireField<LinkingOptions, 'getStateFromPath' | 'getPathFromState'> = {
  prefixes: [WEBAPP_V2_URL, WEBAPP_NATIVE_REDIRECTION_URL, 'passculture://'],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
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
}
