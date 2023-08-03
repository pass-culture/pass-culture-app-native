import React from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type FeatureFlagProps = {
  featureFlag: RemoteStoreFeatureFlags
  children: React.JSX.Element
}

export function FeatureFlag({ featureFlag, children }: FeatureFlagProps) {
  const featureFlagEnabled = useFeatureFlag(featureFlag)

  return featureFlagEnabled ? children : <React.Fragment />
}
