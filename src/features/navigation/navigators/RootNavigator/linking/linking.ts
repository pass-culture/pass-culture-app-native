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

// declared natively in ios/PassCulture/Info.plist and android/app/src/main/AndroidManifest.xml: the prefix is dead code without them
// one scheme per environment, so that a link opens the expected build when several builds are installed on the same device
const PASS_CULTURE_SCHEME_PREFIX = `passculture-${env.ENV}://`

export const linking: RequireField<
  LinkingOptions<RootStackParamList>,
  'getStateFromPath' | 'getPathFromState'
> = {
  prefixes: [
    // must NOT be empty
    WEBAPP_V2_URL,
    PASS_CULTURE_SCHEME_PREFIX,
  ],
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  get config() {
    return rootStackNavigatorPathConfig
  },
}
