import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
  icon: FunctionComponent<IconInterface>
  iconSize: number
  color: ColorsEnum
  testIdSuffix?: string
}

export const InputRule: FunctionComponent<Props> = (props) => {
  const Icon = props.icon
  return (
    <AlignedText>
      <Icon testID={`rule-icon-${props.testIdSuffix}`} color={props.color} size={props.iconSize} />
      <TextContainer>
        <Typo.Caption color={props.color}>{props.title}</Typo.Caption>
      </TextContainer>
    </AlignedText>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})

const TextContainer = styled.View({
  paddingLeft: getSpacing(2),
})
