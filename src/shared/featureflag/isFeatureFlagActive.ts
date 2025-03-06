import { FeatureFlagStore } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAppBuildVersion } from 'libs/packageJson'
import { queryClient } from 'libs/react-query/queryClient'

export const isFeatureFlagActive = (featureFlag: RemoteStoreFeatureFlags): boolean => {
  const featureFlags = queryClient.getQueryData<FeatureFlagStore>('FEATURE_FLAGS')
  const config = featureFlags?.[featureFlag] ?? {}
  const appBuildVersion = getAppBuildVersion()

  const { minimalBuildNumber, maximalBuildNumber } = config
  return (
    (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
    (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion)
  )
}
