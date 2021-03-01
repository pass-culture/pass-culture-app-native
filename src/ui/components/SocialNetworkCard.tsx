import React, { memo } from 'react'
import styled from 'styled-components/native'
import { Typo, getSpacing } from 'ui/theme'
import { TouchableOpacity } from 'react-native'

type SocialNetworkList = 'facebook' | 'instagram' | 'snapchat' | 'twitter'

interface SocialNetworkCardProps {
  network: SocialNetworkList
  onPress: () => void
}

function SocialNetworkCardComponent(props: SocialNetworkCardProps) {
  const { network } = props
  const name = network[0].toUpperCase() + network.slice(1)

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Container>
        <NetworkIconBox />
        <Typo.Caption numberOfLines={2}>
          {name}
        </Typo.Caption>
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
  backgroundColor: 'green',
  justifyContent: 'center'
})