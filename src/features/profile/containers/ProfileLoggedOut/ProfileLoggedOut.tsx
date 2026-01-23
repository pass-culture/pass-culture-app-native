import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { DebugButton } from 'features/profile/components/DebugButton/DebugButton'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { Version } from 'features/profile/components/Version/Version'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { env } from 'libs/environment/env'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'

export const ProfileLoggedOut = ({ featureFlags }: ProfileFeatureFlagsProps) => {
  const version = useVersion()
  const commitHash = env.COMMIT_HASH

  return (
    <View testID="profile-logged-out">
      <LoggedOutHeader featureFlags={featureFlags} />
      <ShareBanner />
      <SocialNetwork />
      <ViewGapWithMarginVertical gap={5}>
        <Separator.Horizontal />
        <Version version={version} commitHash={commitHash} />
        <DebugButton />
      </ViewGapWithMarginVertical>
    </View>
  )
}

const ViewGapWithMarginVertical = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
