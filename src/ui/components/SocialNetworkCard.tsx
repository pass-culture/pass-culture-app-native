import React, { memo } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'

import { SocialNetwork, SocialNetworkIconsMap } from './socials/types'

interface SocialNetworkCardProps {
  network: SocialNetwork
}

function SocialNetworkCardComponent(props: SocialNetworkCardProps) {
  const { network } = props
  const { icon: Icon, link, fallbackLink } = SocialNetworkIconsMap[network]
  const name = capitalizeFirstLetter(network)

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
      <Container gap={1}>
        <NetworkIconBox>
          <StyledIcon />
        </NetworkIconBox>
        <Typo.BodyAccentXs numberOfLines={2}>{name}</Typo.BodyAccentXs>
      </Container>
    </ExternalTouchableLink>
  )
}

export const SocialNetworkCard = memo(SocialNetworkCardComponent)

const Container = styled(ViewGap)({
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
