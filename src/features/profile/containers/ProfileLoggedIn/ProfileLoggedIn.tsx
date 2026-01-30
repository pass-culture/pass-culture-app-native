import React from 'react'
import { View } from 'react-native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { LoggedInContent } from 'features/profile/components/Contents/LoggedInContent/LoggedInContent'
import { LoggedOutButton } from 'features/profile/components/LoggedOutButton/LoggedOutButton'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader as LoggedInHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const ProfileLoggedIn: React.FC<Props> = ({ featureFlags, user }) => {
  const signOut = useLogoutRoutine()
  const title =
    user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Mon profil'

  return (
    <View testID="profile-logged-in">
      <LoggedInHeader title={title} featureFlags={featureFlags} />
      <LoggedInContent user={user} />
      <Separator.Horizontal />
      <LoggedOutButton onPress={signOut} />
    </View>
  )
}
