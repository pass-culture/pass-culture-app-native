import { useEffect } from 'react'

import { useMinimalBuildNumber } from 'features/remoteBanner/helpers/useMinimalBuildNumber'
import { getAppBuildVersion } from 'libs/packageJson'
import { eventMonitoring } from 'libs/monitoring/services'

const DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS = 15000

export enum mustUpdateAppState {
  PENDING = 'pending',
  SHOULD_UPDATE = 'shouldUpdate',
  SHOULD_NOT_UPDATE = 'shouldNotUpdate',
}

export const useMustUpdateApp: () => mustUpdateAppState = () => {
  const { minimalBuildNumber, isLoading } = useMinimalBuildNumber()
  const appBuildVersion = getAppBuildVersion()

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      if (!minimalBuildNumber) {
        eventMonitoring.captureException(new Error('MustUpdateNoMinimalBuildNumberError'), {
          extra: {
            minimalBuildNumber,
            build: appBuildVersion,
          },
        })
      }
    }, DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS)
    return () => {
      clearInterval(timer)
    }
  }, [appBuildVersion, minimalBuildNumber])

  if (isLoading) return mustUpdateAppState.PENDING

  const isLocalBuildSmallerThanMinimalBuild =
    !!minimalBuildNumber && appBuildVersion < minimalBuildNumber

  const mustUpdateApp = isLocalBuildSmallerThanMinimalBuild
    ? mustUpdateAppState.SHOULD_UPDATE
    : mustUpdateAppState.SHOULD_NOT_UPDATE

  return mustUpdateApp
}
