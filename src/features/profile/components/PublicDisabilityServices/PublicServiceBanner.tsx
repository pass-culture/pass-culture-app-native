import React from 'react'
import styled from 'styled-components/native'

import { PublicService } from 'features/profile/pages/Accessibility/PublicDisabilityServices'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Typo } from 'ui/theme'

export const PublicServiceBanner = ({ name, url, description, illustration }: PublicService) => (
  <ExternalTouchableLink externalNav={{ url }}>
    <GenericBanner LeftIcon={illustration} RightIcon={StyledExternalSite}>
      <ViewGap gap={2}>
        <Typo.Button>{name}</Typo.Button>
        <StyledBody>{description}</StyledBody>
      </ViewGap>
    </GenericBanner>
  </ExternalTouchableLink>
)

const StyledBody = styled(Typo.BodyS)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledExternalSite = styled(ExternalSite).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.designSystem.size.icon.m,
}))``
