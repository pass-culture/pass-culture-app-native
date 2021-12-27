import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

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
    <StyledView>
      <Icon testID={`rule-icon-${props.testIdSuffix}`} color={props.color} size={props.iconSize} />
      <Spacer.Row numberOfSpaces={1} />
      <StyledTypoCaption color={props.color}>{props.title}</StyledTypoCaption>
    </StyledView>
  )
}

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})

const StyledTypoCaption = styled(Typo.Caption)({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
})
