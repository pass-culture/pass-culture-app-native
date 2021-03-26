import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { Typo, getSpacing, Spacer } from 'ui/theme'

import { SocialNetwork, SocialNetworkIconsMap } from './socials/types'

interface SocialNetworkCardProps {
  network: SocialNetwork
}

function SocialNetworkCardComponent(props: SocialNetworkCardProps) {
  const { network } = props
  const { icon: Icon, link } = SocialNetworkIconsMap[network]
  const name = network[0].toUpperCase() + network.slice(1)

  return (
    <TouchableOpacity
      onPress={() => {
        analytics.logClickSocialNetwork(name)
        openExternalUrl(link, false)
      }}>
      <Container>
        <NetworkIconBox>
          <Icon size={24} />
        </NetworkIconBox>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption numberOfLines={2}>{name}</Typo.Caption>
      </Container>
    </TouchableOpacity>
  )
}

export const SocialNetworkCard = memo(SocialNetworkCardComponent)

const Container = styled.View({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: getSpacing(18),
})

const NetworkIconBox = styled.View({
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
})
