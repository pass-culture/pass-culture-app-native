import { LinkingOptions } from '@react-navigation/native'

import { rootStackNavigatorPathConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { RequireField } from 'libs/typesUtils/typeHelpers'

import { getInitialURL } from './getInitialUrl'
import { customGetPathFromState } from './getPathFromState'
import { customGetStateFromPath } from './getStateFromPath'
import { subscribe } from './subscribe'

const PASS_CULTURE_PREFIX_URL = 'passculture://'
const PASS_CULTURE_STAGING_PREFIX_URL = 'passculture-staging://'

const prefixes = [
  // must NOT be empty
  WEBAPP_V2_URL,
  PASS_CULTURE_PREFIX_URL,
]

if (process.env.APP_ENV === 'staging') {
  prefixes.push(PASS_CULTURE_STAGING_PREFIX_URL)
}

export const linking: RequireField<
  LinkingOptions<RootStackParamList>,
  'getStateFromPath' | 'getPathFromState'
> = {
  prefixes,
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  config: { screens: rootStackNavigatorPathConfig },
}
