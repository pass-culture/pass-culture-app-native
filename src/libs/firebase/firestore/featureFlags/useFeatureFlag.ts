import { useEffect, useState } from 'react'

import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'
import { getAppBuildVersion } from 'libs/packageJson'

const appBuildVersion = getAppBuildVersion()

// firestore feature flag documentation :
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlag = (
  remoteStorefeatureFlag: RemoteStoreFeatureFlags
): boolean | undefined => {
  const [buildNumberConfig, setBuildNumberConfig] = useState<{
    minimalBuildNumber?: number | null
    maximalBuildNumber?: number | null
  }>({})

  useEffect(() => {
    async function fetchFeatureFlag() {
      return getFeatureFlag(remoteStorefeatureFlag)
    }

    fetchFeatureFlag().then((featureFlag) => {
      setBuildNumberConfig({
        minimalBuildNumber: featureFlag?.minimalBuildNumber || null,
        maximalBuildNumber: featureFlag?.maximalBuildNumber || null,
      })
    })
  }, [remoteStorefeatureFlag])

  const { minimalBuildNumber, maximalBuildNumber } = buildNumberConfig

  if (minimalBuildNumber === maximalBuildNumber) return minimalBuildNumber === appBuildVersion

  if (!!(minimalBuildNumber && maximalBuildNumber) && minimalBuildNumber > maximalBuildNumber) {
    eventMonitoring.captureMessage(
      `Minimal build number is greater than maximal build number for feature flag ${remoteStorefeatureFlag}`,
      {
        extra: {
          minimalBuildNumber,
          maximalBuildNumber,
        },
      }
    )
    return false
  }

  if (maximalBuildNumber) return appBuildVersion <= maximalBuildNumber

  return !!minimalBuildNumber && appBuildVersion >= minimalBuildNumber
}
