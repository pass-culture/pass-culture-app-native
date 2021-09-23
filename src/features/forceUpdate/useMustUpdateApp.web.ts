import { useMinimalBuildNumber } from 'features/forceUpdate/useMinimalBuildNumber'
import { useServiceWorker } from 'web/useServiceWorker'

import { build } from '../../../package.json'

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useMinimalBuildNumber()
  const { serviceWorkerStatus } = useServiceWorker()

  // eslint-disable-next-line no-console
  console.log('useMustUpdateApp', {
    minimalBuildNumber,
    build,
    mustUpdateApp: !!minimalBuildNumber && build < minimalBuildNumber,
  })
  return serviceWorkerStatus === 'updated' || (!!minimalBuildNumber && build < minimalBuildNumber)
}
