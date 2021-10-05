import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface ProfileBadgeProps {
  message: string
  icon?: FunctionComponent<IconInterface>
  testID?: string
}

export function ProfileBadge(props: ProfileBadgeProps) {
  const Icon = props.icon
  return (
    <Container testID={props.testID || 'profile-badge'}>
      {Icon ? (
        <IconContainer>
          <Icon size={48} />
        </IconContainer>
      ) : null}
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
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})
