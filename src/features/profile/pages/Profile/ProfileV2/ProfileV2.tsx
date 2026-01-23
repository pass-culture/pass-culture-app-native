import React from 'react'

import { ProfileOffline } from 'features/profile/containers/ProfileOffline/ProfileOffline'
import { ProfileOnline } from 'features/profile/containers/ProfileOnline/ProfileOnline'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'

export const ProfileV2 = () => {
  const { isConnected } = useNetInfoContext()
  return isConnected ? <ProfileOnline /> : <ProfileOffline />
}
