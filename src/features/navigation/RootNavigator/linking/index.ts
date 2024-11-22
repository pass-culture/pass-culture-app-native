import { LinkingOptions } from '@react-navigation/native'

import { linkingPrefixes } from 'features/navigation/RootNavigator/linking/linkingPrefixes'
import { rootScreensConfig } from 'features/navigation/RootNavigator/screens'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { RequireField } from 'libs/typesUtils/typeHelpers'

import { getInitialURL } from './getInitialUrl'
import { customGetPathFromState } from './getPathFromState'
import { customGetStateFromPath } from './getStateFromPath'
import { subscribe } from './subscribe'

export const linking: RequireField<
  LinkingOptions<RootStackParamList>,
  'getStateFromPath' | 'getPathFromState'
> = {
  prefixes: linkingPrefixes,
  getInitialURL: getInitialURL,
  subscribe: subscribe,
  getStateFromPath: customGetStateFromPath,
  getPathFromState: customGetPathFromState,
  config: { screens: rootScreensConfig },
}
