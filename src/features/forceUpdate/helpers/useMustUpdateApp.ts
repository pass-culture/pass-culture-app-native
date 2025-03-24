import { useEffect } from 'react'

import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { eventMonitoring } from 'libs/monitoring/services'
import { getAppBuildVersion } from 'libs/packageJson'

const DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS = 15000

export enum MustUpdateAppState {
  PENDING = 'pending',
  SHOULD_UPDATE = 'shouldUpdate',
  SHOULD_NOT_UPDATE = 'shouldNotUpdate',
}

export const useMustUpdateApp: () => MustUpdateAppState = () => {
  const { minimalBuildNumber, isLoading, error } = useMinimalBuildNumber()
  const appBuildVersion = getAppBuildVersion()

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      if (!isLoading && !minimalBuildNumber && error) {
        eventMonitoring.captureException(new Error('MustUpdateNoMinimalBuildNumberError'), {
          extra: {
            minimalBuildNumber,
            build: appBuildVersion,
            error,
          },
        })
      }
    }, DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS)
    return () => {
      clearInterval(timer)
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
