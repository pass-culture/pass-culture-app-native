import { LinkingOptions } from '@react-navigation/native'

import { rootScreensConfig } from 'features/navigation/RootNavigator/screens'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { WEBAPP_V2_URL } from 'libs/environment'
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
    PASS_CULTURE_PREFIX_URL,
  ],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  config: { screens: rootScreensConfig },
}
