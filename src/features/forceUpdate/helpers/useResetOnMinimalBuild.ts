import { useEffect } from 'react'

import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber/useMinimalBuildNumber'
import { getAppBuildVersion } from 'libs/packageJson'

export function useResetOnMinimalBuild(resetErrorBoundary: () => void) {
  const minimalBuildNumber = useMinimalBuildNumber()

  // This first hook will be like a componentWillUnmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetErrorBoundary, [])

  // This one is for when minimalBuildNumber gets back to an older value
  useEffect(() => {
    // it must be false and not null (which means not fetched)
    if (!!minimalBuildNumber && getAppBuildVersion() >= minimalBuildNumber) {
      resetErrorBoundary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimalBuildNumber])
}
