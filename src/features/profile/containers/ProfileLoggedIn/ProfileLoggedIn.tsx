import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { DebugButton } from 'features/profile/components/DebugButton/DebugButton'
import { LoggedOutButton } from 'features/profile/components/LoggedOutButton/LoggedOutButton'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { Version } from 'features/profile/components/Version/Version'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { env } from 'libs/environment/env'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const ProfileLoggedIn: React.FC<Props> = ({ featureFlags, user }) => {
  const signOut = useLogoutRoutine()
  const version = useVersion()
  const commitHash = env.COMMIT_HASH
  const title = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''

  return (
    <View testID="profile-logged-in">
      <PageHeader title={title} featureFlags={featureFlags} />
      <ShareBanner />
      <SocialNetwork />
      <ViewGapWithMarginBottom gap={5}>
        <Separator.Horizontal />
        <LoggedOutButton onPress={signOut} />
        <Separator.Horizontal />
        <Version version={version} commitHash={commitHash} />
        <DebugButton />
      </ViewGapWithMarginBottom>
    </View>
  )
}

const ViewGapWithMarginBottom = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
