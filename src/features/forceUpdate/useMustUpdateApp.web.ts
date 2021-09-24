import { useMinimalBuildNumber } from 'features/forceUpdate/useMinimalBuildNumber'
import { useServiceWorker } from 'web/useServiceWorker'

import { build } from '../../../package.json'

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useMinimalBuildNumber()
  const { serviceWorkerStatus } = useServiceWorker()
  return serviceWorkerStatus === 'updated' || (!!minimalBuildNumber && build < minimalBuildNumber)
}
