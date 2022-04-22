import { getStateFromPath } from '@react-navigation/native'

type Path = Parameters<typeof getStateFromPath>[0]
type Config = Parameters<typeof getStateFromPath>[1]

export function customGetStateFromPath(path: Path, config: Config) {
  return getStateFromPath(path, config)
}
