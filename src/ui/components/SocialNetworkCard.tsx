import React, { memo } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { SocialNetwork, SocialNetworkIconsMap } from './socials/types'

interface SocialNetworkCardProps {
  network: SocialNetwork
}

function SocialNetworkCardComponent(props: SocialNetworkCardProps) {
  const { network } = props
  const { icon: Icon, link, fallbackLink } = SocialNetworkIconsMap[network]
  // @ts-expect-error: because of noUncheckedIndexedAccess
  const name = network[0].toUpperCase() + network.slice(1)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  const onBeforeNavigate = () => {
    const network = name === 'X' ? 'Twitter' : name
    analytics.logClickSocialNetwork(network)
  }

  return (
    <ExternalTouchableLink
      externalNav={{ url: link, params: { shouldLogEvent: false, fallbackUrl: fallbackLink } }}
      onBeforeNavigate={onBeforeNavigate}>
      <Container>
        <NetworkIconBox>
          <StyledIcon />
        </NetworkIconBox>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.BodyAccentXs numberOfLines={2}>{name}</Typo.BodyAccentXs>
      </Container>
    </ExternalTouchableLink>
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
