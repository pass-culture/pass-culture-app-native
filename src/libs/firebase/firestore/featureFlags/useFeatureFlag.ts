import { useEffect, useState } from 'react'

import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { build } from '../../../../../package.json'

// firestore feature flag documentation :
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlag = (featureFlag: RemoteStoreFeatureFlags) => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number>()

  useEffect(() => {
    async function getMinimalBuildNumber() {
      const disableStoreReview = await getFeatureFlag(featureFlag)
      setMinimalBuildNumber(disableStoreReview?.minimalBuildNumber)
    }
    getMinimalBuildNumber()
  }, [featureFlag])

  return !!minimalBuildNumber && build >= minimalBuildNumber
}
