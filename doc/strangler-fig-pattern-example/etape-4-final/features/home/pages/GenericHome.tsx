/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react'

// Le feature flag et le composant legacy ne sont plus nécessaires
// import { useFeatureFlag } from '../../../libs/firebase/firestore/featureFlags/useFeatureFlag'
// import { RemoteStoreFeatureFlags } from '../../../libs/firebase/firestore/types'
// import { GenericHomeLegacy } from './GenericHomeLegacy'

import { OnlineHome as ModernOnlineHome } from './GenericHomeModern'

type GenericHomeProps = {
  // ... props
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // Le nouveau module est directement utilisé
  return <ModernOnlineHome {...props} />
}