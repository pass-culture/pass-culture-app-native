import { getPathFromState } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { isTabScreen } from 'features/navigation/TabBar/routes'

type Params = Parameters<typeof getPathFromState>
type State = Params[0]
type Config = Params[1]

export function customGetPathFromState(state: State, config: Config) {
  const path = getPathFromState(state, config, isTabScreen as (name: string) => boolean)
  // We cannot customize the 404 screen path with react-navigation, as it takes the screen names instead.
  // See this issue : https://github.com/react-navigation/react-navigation/issues/9102
  const pageNotFoundScreenName: ScreenNames = 'PageNotFound'
  if (path.includes(pageNotFoundScreenName)) {
    return 'page-introuvable'
  }
  return path
}
