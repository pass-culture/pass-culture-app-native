import React from 'react'
import { View } from 'react-native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { LoggedOutButton } from 'features/profile/components/Buttons/LoggedOutButton/LoggedOutButton'
import { LoggedInContent } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInContent'
import { LoggedInHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { Separator } from 'ui/components/Separator'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const ProfileLoggedIn: React.FC<Props> = ({ featureFlags, user }) => {
  const signOut = useLogoutRoutine()
  return (
    <View testID="profile-logged-in">
      <LoggedInHeader user={user} featureFlags={featureFlags} />
      <LoggedInContent user={user} />
      <Separator.Horizontal />
      <LoggedOutButton onPress={signOut} />
    </View>
  )
}
