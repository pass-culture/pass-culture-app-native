import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
  icon: FunctionComponent<IconInterface>
  color: ColorsEnum
  testIdSuffix?: string
}

const ICON_SIZE = 16

export const InputRule: FunctionComponent<Props> = (props) => {
  const Icon = props.icon
  return (
    <AlignedText>
      <Icon testID={`rule-icon-${props.testIdSuffix}`} color={props.color} size={ICON_SIZE} />
      <TextContainer>
        <Typo.Caption color={props.color}>{props.title}</Typo.Caption>
      </TextContainer>
    </AlignedText>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
})

const TextContainer = styled.View({
  paddingLeft: getSpacing(2),
})
