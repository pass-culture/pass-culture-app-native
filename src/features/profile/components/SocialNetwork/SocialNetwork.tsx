import React from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

export function SocialNetwork() {
  return (
    <NetworkRow>
      <NetworkRowContainer>
        <StyledUl>
          <Li>
            <SocialNetworkCard network="instagram" />
          </Li>
          <Li>
            <SocialNetworkCard network="twitter" />
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
  )
}

const NetworkRow = styled.View(({ theme }) => ({
  width: '100%',
  margin: theme.isDesktopViewport ? undefined : 'auto',
  maxWidth: theme.contentPage.maxWidth,
}))

const NetworkRowContainer = styled.View({
  flexDirection: 'row',
  paddingVertical: getSpacing(4),
  justifyContent: 'space-between',
})

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
})
