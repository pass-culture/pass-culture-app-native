import { useMinimalBuildNumber } from 'features/forceUpdate/useMinimalBuildNumber'

import { build } from '../../../package.json'

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useMinimalBuildNumber()
  return !!minimalBuildNumber && build < minimalBuildNumber
}
