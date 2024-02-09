import { useEffect, useState } from 'react'

import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAppBuildVersion } from 'libs/packageJson'

// firestore feature flag documentation :
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlag = (
  remoteStorefeatureFlag: RemoteStoreFeatureFlags
): boolean | undefined => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number | null>()

  useEffect(() => {
    async function getMinimalBuildNumber() {
      const featureFlag = await getFeatureFlag(remoteStorefeatureFlag)
      setMinimalBuildNumber(featureFlag?.minimalBuildNumber || null)
    }
    getMinimalBuildNumber()
  }, [remoteStorefeatureFlag])

  if (minimalBuildNumber === undefined) return undefined

  return !!minimalBuildNumber && getAppBuildVersion() >= minimalBuildNumber
}
