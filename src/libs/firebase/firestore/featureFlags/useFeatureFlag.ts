import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig, FeatureFlagDocument } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'
import { getAppBuildVersion } from 'libs/packageJson'
import { QueryKeys } from 'libs/queryKeys'

const appBuildVersion = getAppBuildVersion()

export const useGetFeatureFlagDocSnapshot = () => {
  const { data: docSnapshot } = useQuery(QueryKeys.FEATURE_FLAGS, getAllFeatureFlags, {
    staleTime: 1000 * 30, // 30 seconds
  })

  return docSnapshot
}

export const useGetAllFeatureFlags = () => {
  const docSnapshot = useGetFeatureFlagDocSnapshot()
  const featureFlags = useMemo(
    () =>
      (Object.keys(RemoteStoreFeatureFlags) as RemoteStoreFeatureFlags[]).reduce(
        (previous, current) => {
          return {
            ...previous,
            [current]: docSnapshot ? isFeatureFlagActive(docSnapshot, current) : false,
          }
        },
        {} as Record<keyof typeof RemoteStoreFeatureFlags, boolean>
      ),
    [docSnapshot]
  )

  return featureFlags
}
// firestore feature flag documentation:
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlag = (featureFlag: RemoteStoreFeatureFlags): boolean => {
  const docSnapshot = useGetFeatureFlagDocSnapshot()

  if (!docSnapshot) return false

  return isFeatureFlagActive(docSnapshot, featureFlag)
}

export const isFeatureFlagActive = (
  featureFlagDocument: FeatureFlagDocument,
  featureFlag: RemoteStoreFeatureFlags | keyof typeof RemoteStoreFeatureFlags
) => {
  const remoteStoreFeatureFlag: RemoteStoreFeatureFlags = isStringKeyOfRemoteStoreFeatureFlags(
    featureFlag
  )
    ? RemoteStoreFeatureFlags[featureFlag]
    : featureFlag

  const { minimalBuildNumber, maximalBuildNumber } =
    featureFlagDocument.get<FeatureFlagConfig>(remoteStoreFeatureFlag) ?? {}

  if (minimalBuildNumber === undefined && maximalBuildNumber === undefined) return false

  if (!!(minimalBuildNumber && maximalBuildNumber) && minimalBuildNumber > maximalBuildNumber) {
    eventMonitoring.captureException(
      `Minimal build number is greater than maximal build number for feature flag ${featureFlag}`,
      {
        level: 'info',
        extra: {
          minimalBuildNumber,
          maximalBuildNumber,
        },
      }
    )
    return false
  }
  return (
    (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
    (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion)
  )
}

const isStringKeyOfRemoteStoreFeatureFlags = (
  key: string
): key is keyof typeof RemoteStoreFeatureFlags => key in RemoteStoreFeatureFlags
