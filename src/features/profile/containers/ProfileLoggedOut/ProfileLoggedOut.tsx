import React from 'react'
import { View } from 'react-native'

import { LoggedOutContent } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/LoggedOutContent'
import { LoggedOutHeader } from 'features/profile/containers/ProfileLoggedOut/LoggedOutHeader/LoggedOutHeader'
import { UserProfile } from 'features/share/types'

type Props = { user?: UserProfile }

export const ProfileLoggedOut = ({ user }: Props) => (
  <View testID="profile-logged-out">
    <LoggedOutHeader />
    <LoggedOutContent user={user} />
  </View>
)
