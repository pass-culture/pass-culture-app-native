import React from 'react'
import { View } from 'react-native'

import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { LoggedOutContent } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/LoggedOutContent'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type Props = { user?: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const ProfileLoggedOut = ({ featureFlags, user }: Props) => (
  <View testID="profile-logged-out">
    <LoggedOutHeader featureFlags={featureFlags} />
    <LoggedOutContent user={user} />
  </View>
)
