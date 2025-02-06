import { useEffect } from 'react'

import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { getAppBuildVersion } from 'libs/packageJson'

export function useResetOnMinimalBuild(resetErrorBoundary: () => void) {
  const { minimalBuildNumber, isLoading } = useMinimalBuildNumber()

  // This first hook will be like a componentWillUnmount
  useEffect(() => resetErrorBoundary, [resetErrorBoundary])

  // This one is for when minimalBuildNumber gets back to an older value
  useEffect(() => {
    // it must be false and not null (which means not fetched)
    if (!isLoading && minimalBuildNumber && getAppBuildVersion() >= minimalBuildNumber) {
      resetErrorBoundary()
    }
  }, [isLoading, minimalBuildNumber, resetErrorBoundary])
}
