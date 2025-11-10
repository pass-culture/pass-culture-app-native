import { onlineManager, useQuery } from '@tanstack/react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig, squads } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { getAppBuildVersion } from 'libs/packageJson'
import { QueryKeys } from 'libs/queryKeys'

const appBuildVersion = getAppBuildVersion()

export type FeatureFlagOptions = {
  isFeatureFlagActive: boolean
  owner?: squads
  options?: Record<string, unknown>
}

// firestore feature flag documentation:
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlagOptionsQuery = (
  featureFlag: RemoteStoreFeatureFlags
): FeatureFlagOptions => {
  const { data: docSnapshot, isLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_FLAGS],
    queryFn: getAllFeatureFlags,
    staleTime: 1000 * 60 * 60 * 24, // 24h (re-renders whole app because of usage of feature flag in the ThemeWrapper)
    enabled: onlineManager.isOnline(),
  })
  const { logType } = useLogTypeFromRemoteConfig()

  if (isLoading || !docSnapshot) return { isFeatureFlagActive: false }

  const { minimalBuildNumber, maximalBuildNumber, options, owner } =
    docSnapshot.get<FeatureFlagConfig>(featureFlag) ?? {}

  if (minimalBuildNumber === undefined && maximalBuildNumber === undefined)
    return { isFeatureFlagActive: false, owner, options }

  if (
    !!(minimalBuildNumber && maximalBuildNumber) &&
    minimalBuildNumber > maximalBuildNumber &&
    logType === LogTypeEnum.INFO
  ) {
    eventMonitoring.captureException(
      `Minimal build number is greater than maximal build number for feature flag ${featureFlag}`,
      {
        level: logType,
        extra: {
          minimalBuildNumber,
          maximalBuildNumber,
        },
      }
    )
    return { isFeatureFlagActive: false, owner, options }
  }

  return {
    isFeatureFlagActive:
      (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
      (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion),
    owner,
    options,
  }
}
