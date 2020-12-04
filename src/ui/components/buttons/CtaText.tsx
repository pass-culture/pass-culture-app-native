import React, { FunctionComponent } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface CtaTextProps {
  title: string
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
  iconSize?: number
  textSize?: number
  onPress: () => void
}

export const CtaText: FunctionComponent<CtaTextProps> = (props) => {
  const Icon = props.icon
  return (
    <CtaTextContainer onPress={props.onPress}>
      {Icon && <Icon testID="button-icon" color={props.color} size={props.iconSize} />}
      <Title
        testID="button-title"
        textColor={props.color}
        textSize={props.textSize}
        numberOfLines={1}>
        {props.title}
      </Title>
    </CtaTextContainer>
  )
}

interface TitleProps {
  textColor?: ColorsEnum
  textSize?: number
}

const CtaTextContainer = styled.Text({
  paddingHorizontal: 5,
  justifyContent: 'center',
})

const Title = styled(Typo.ButtonText)<TitleProps>(({ textColor, textSize }) => ({
  maxWidth: Dimensions.get('screen').width - getSpacing(25),
  color: textColor,
  fontSize: textSize,
  marginLeft: 5,
  flexWrap: 'wrap',
}))
