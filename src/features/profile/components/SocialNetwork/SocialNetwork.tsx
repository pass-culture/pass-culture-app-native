import React from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { Ul } from 'ui/components/Ul'

export const SocialNetwork = () => (
  <NetworkRowContainer>
    <StyledUl>
      <Li>
        <SocialNetworkCard network="instagram" />
      </Li>
      <Li>
        <SocialNetworkCard network="x" />
      </Li>
      <Li>
        <SocialNetworkCard network="tiktok" />
      </Li>
      <Li>
        <SocialNetworkCard network="facebook" />
      </Li>
    </StyledUl>
  </NetworkRowContainer>
)

const NetworkRowContainer = styled.View(({ theme }) => ({
  width: '100%',
  margin: theme.isDesktopViewport ? undefined : 'auto',
  maxWidth: theme.contentPage.maxWidth,
  flexDirection: 'row',
  paddingVertical: theme.designSystem.size.spacing.l,
  justifyContent: 'space-between',
}))

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
})
