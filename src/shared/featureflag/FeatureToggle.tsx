import { ReactElement } from 'react'

import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { isFeatureFlagActive } from './isFeatureFlagActive'

interface FeatureToggleProps {
  featureFlag: RemoteStoreFeatureFlags
  children: (isActive: boolean) => ReactElement
}

export const FeatureToggle = ({ children, featureFlag }: FeatureToggleProps) => {
  return children(isFeatureFlagActive(featureFlag))
}
