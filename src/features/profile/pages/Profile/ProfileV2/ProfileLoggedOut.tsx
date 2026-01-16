import React from 'react'
import styled from 'styled-components/native'

import { DebugButton } from 'features/profile/components/DebugButton/DebugButton'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { Version } from 'features/profile/components/Version/Version'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ProfileLoggedOut = ({ featureFlags }) => (
  <React.Fragment>
    <LoggedOutHeader featureFlags={featureFlags} />
    <ShareBanner />
    <SocialNetwork />
    <ViewGapWithMarginTop gap={5}>
      <Separator.Horizontal />
      <Version />
      <DebugButton />
    </ViewGapWithMarginTop>
  </React.Fragment>
)

const ViewGapWithMarginTop = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
