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

export const PASS_CULTURE_PREFIX_URL = `${env.URL_PREFIX}://`
// Adjust link domain, declared natively in ios/PassCulture/PassCulture.entitlements and android/app/src/main/AndroidManifest.xml
export const ADJUST_LINK_PREFIX = 'https://passculture.go.link'

export const linking: RequireField<
  LinkingOptions<RootStackParamList>,
  'getStateFromPath' | 'getPathFromState'
> = {
  prefixes: [
    // must NOT be empty
    WEBAPP_V2_URL,
    PASS_CULTURE_PREFIX_URL,
    // the path of an Adjust link is the screen to open: `https://passculture.go.link/<path>?adj_t=<tracker>`
    ADJUST_LINK_PREFIX,
  ],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  get config() {
    return rootStackNavigatorPathConfig
  },
}
