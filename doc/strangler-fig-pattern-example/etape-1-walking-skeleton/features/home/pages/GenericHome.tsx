/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react'

import { useFeatureFlag } from '../../../libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from '../../../libs/firebase/firestore/types'

import { GenericHomeLegacy } from './GenericHomeLegacy'
import { OnlineHome as ModernOnlineHome } from './GenericHomeModern'

type GenericHomeProps = {
  // ... props
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  const useModernHome = useFeatureFlag(RemoteStoreFeatureFlags.USE_MODERN_HOME_MODULE)

  if (useModernHome) {
    return <ModernOnlineHome {...props} />
  } else {
    return <GenericHomeLegacy {...props} />
  }
}