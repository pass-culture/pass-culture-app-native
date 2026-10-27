import { LinkingOptions } from '@react-navigation/native'

import { rootStackNavigatorPathConfig } from 'features/navigation/navigators/RootNavigator/linking/rootStackNavigatorPathConfig'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { RequireField } from 'libs/typesUtils/typeHelpers'

import { getInitialURL } from './getInitialUrl'
import { customGetPathFromState } from './getPathFromState'
import { customGetStateFromPath } from './getStateFromPath'
import { subscribe } from './subscribe'

const PASS_CULTURE_PREFIX_URL = 'passculture://'

export const linking: RequireField<
  LinkingOptions<RootStackParamList>,
  'getStateFromPath' | 'getPathFromState'
> = {
  prefixes: [
    // must NOT be empty
    WEBAPP_V2_URL,
    // the web app meta tags (al:*:url, twitter:app:url:*) advertise `passculture://<WEBAPP_V2_URL>/<path>` links
    `${PASS_CULTURE_PREFIX_URL}${WEBAPP_V2_URL}`,
    // iOS delivers these links without the colon of the embedded scheme: `passculture://https//<WEBAPP_V2_DOMAIN>/<path>`
    `${PASS_CULTURE_PREFIX_URL}https//${env.WEBAPP_V2_DOMAIN}`,
    PASS_CULTURE_PREFIX_URL,
  ],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  get config() {
    return rootStackNavigatorPathConfig
  },
}
