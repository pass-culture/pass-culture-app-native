import { getPathFromState } from '@react-navigation/native'

type Params = Parameters<typeof getPathFromState>
type State = Params[0]
type Config = Params[1]

export function customGetPathFromState(state: State, config: Config) {
  return getPathFromState(state, config)
}
