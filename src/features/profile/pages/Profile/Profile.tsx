import React from 'react'

import { ProfileV1 } from 'features/profile/pages/Profile/ProfileV1/ProfileV1'
import { ProfileV2 } from 'features/profile/pages/Profile/ProfileV2/ProfileV2'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const Profile = () => {
  const enableProfileV2 = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PROFILE_V2)
  return enableProfileV2 ? <ProfileV2 /> : <ProfileV1 />
}
