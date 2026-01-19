import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ProfileOffline } from 'features/profile/pages/Profile/ProfileV2/ProfileOffline'
import { ProfileOnline } from 'features/profile/pages/Profile/ProfileV2/ProfileOnline'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'

type Props = {
  featureFlags: { enablePassForAll: boolean; enableProfileV2: boolean }
}

export const ProfileV2 = ({ featureFlags }: Props) => {
  const { isConnected } = useNetInfoContext()
  const { isLoggedIn, user } = useAuthContext()

  if (isConnected) {
    return <ProfileOnline featureFlags={featureFlags} isLoggedIn={isLoggedIn} user={user} />
  }
  return <ProfileOffline />
}
