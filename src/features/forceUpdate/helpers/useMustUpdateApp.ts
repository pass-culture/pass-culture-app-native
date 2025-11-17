import { useEffect } from 'react'

import { useMinimalBuildNumberQuery } from 'features/forceUpdate/queries/useMinimalBuildNumberQuery'
import { eventMonitoring } from 'libs/monitoring/services'
import { getAppBuildVersion } from 'libs/packageJson'

export enum MustUpdateAppState {
  PENDING = 'pending',
  SHOULD_UPDATE = 'shouldUpdate',
  SHOULD_NOT_UPDATE = 'shouldNotUpdate',
}

export const useMustUpdateApp: () => MustUpdateAppState = () => {
  const { minimalBuildNumber, isLoading, error } = useMinimalBuildNumberQuery()
  const appBuildVersion = getAppBuildVersion()

  useEffect(() => {
    if (!isLoading && !minimalBuildNumber && error) {
      eventMonitoring.captureException(new Error('MustUpdateNoMinimalBuildNumberError'), {
        extra: {
          minimalBuildNumber,
          build: appBuildVersion,
          error,
        },
      })
    }
  }, [appBuildVersion, error, isLoading, minimalBuildNumber])

  if (isLoading) return MustUpdateAppState.PENDING

  const isLocalBuildSmallerThanMinimalBuild =
    !!minimalBuildNumber && appBuildVersion < minimalBuildNumber

  const mustUpdateApp = isLocalBuildSmallerThanMinimalBuild
    ? MustUpdateAppState.SHOULD_UPDATE
    : MustUpdateAppState.SHOULD_NOT_UPDATE

  return mustUpdateApp
}
