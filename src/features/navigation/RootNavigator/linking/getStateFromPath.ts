import { getStateFromPath } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'

type Params = Parameters<typeof getStateFromPath>
type Path = Params[0]
type Config = Params[1]

export function customGetStateFromPath(path: Path, config: Config) {
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
}
