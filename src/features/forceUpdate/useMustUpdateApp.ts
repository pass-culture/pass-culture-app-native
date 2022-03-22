import { useMinimalBuildNumber } from 'features/forceUpdate/useMinimalBuildNumber'
import { eventMonitoring } from 'libs/monitoring'

import { build } from '../../../package.json'

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useMinimalBuildNumber()
  const mustUpdateApp = !!minimalBuildNumber && build < minimalBuildNumber

  if (mustUpdateApp && !build) {
    eventMonitoring.captureException(new Error('MustUpdateAppError'), {
      extra: {
        mustUpdateApp,
        minimalBuildNumber,
        build,
      },
    })
  }

  return mustUpdateApp
}
