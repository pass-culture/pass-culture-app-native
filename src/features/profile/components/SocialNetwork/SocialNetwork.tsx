import React from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { Section } from 'ui/components/Section'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { Ul } from 'ui/components/Ul'

export function SocialNetwork() {
  return (
    <Section title="Suivre le pass Culture">
      <NetworkRow>
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
      </NetworkRow>
    </Section>
  )
}

const NetworkRow = styled.View(({ theme }) => ({
  width: '100%',
  margin: theme.isDesktopViewport ? undefined : 'auto',
  maxWidth: theme.contentPage.maxWidth,
}))

const NetworkRowContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  paddingVertical: theme.designSystem.size.spacing.l,
  justifyContent: 'space-between',
}))

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
})
