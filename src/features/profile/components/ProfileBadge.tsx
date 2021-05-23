import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface ProfileBadgeProps {
  message: string
  icon: FunctionComponent<IconInterface>
}

export function ProfileBadge(props: ProfileBadgeProps) {
  const Icon = props.icon
  return (
    <Container testID="younger-badge">
      <IconContainer>
        <Icon size={48} />
      </IconContainer>
      <TextContainer>
        <Typo.Caption>{props.message}</Typo.Caption>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 6,
  padding: getSpacing(4),
})

const IconContainer = styled.View({
  flex: 0.1,
  minWidth: 48,
  maxWidth: 48,
})
const TextContainer = styled.View({
  flex: 0.85,
})
