import React, { memo } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Typo, getSpacing, Spacer } from 'ui/theme'

import { SocialNetwork, SocialNetworkIconsMap } from './socials/types'

interface SocialNetworkCardProps {
  network: SocialNetwork
}

function SocialNetworkCardComponent(props: SocialNetworkCardProps) {
  const { network } = props
  const { icon: Icon, link, fallbackLink } = SocialNetworkIconsMap[network]
  const name = network[0].toUpperCase() + network.slice(1)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  return (
    <TouchableLink
      externalNav={{ url: link, params: { shouldLogEvent: false, fallbackUrl: fallbackLink } }}
      onBeforeNavigate={() => {
        analytics.logClickSocialNetwork(name)
      }}
      isOnPressDebounced>
      <Container>
        <NetworkIconBox>
          <StyledIcon />
        </NetworkIconBox>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption numberOfLines={2}>{name}</Typo.Caption>
      </Container>
    </TouchableLink>
  )
}

export const SocialNetworkCard = memo(SocialNetworkCardComponent)

const Container = styled.View({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: getSpacing(20),
})

const NetworkIconBox = styled.View({
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
})
