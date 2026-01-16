import React from 'react'

import { DebugButton } from 'features/profile/components/DebugButton/DebugButton'
import { LoggedOutButton } from 'features/profile/components/LoggedOutButton/LoggedOutButton'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { Version } from 'features/profile/components/Version/Version'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  featureFlags: { enableProfileV2: boolean }
  user: UserProfileResponseWithoutSurvey
}

export const ProfileLoggedIn: React.FC<Props> = ({ featureFlags, user }) => {
  const title = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''
  return (
    <React.Fragment>
      <PageHeader title={title} featureFlags={featureFlags} />
      <ShareBanner />
      <SocialNetwork />
      <ViewGap gap={5}>
        <Separator.Horizontal />
        <LoggedOutButton />
        <Separator.Horizontal />
        <Version />
        <DebugButton />
      </ViewGap>
    </React.Fragment>
  )
}
