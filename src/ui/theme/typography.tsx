import React from 'react'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, UniqueColors } from './colors'
import { useGrid } from './grid'
import { getSpacing, getSpacingString } from './spacing'

interface CustomTextProps {
  color?: ColorsEnum | UniqueColors
}
type TextProps = CustomTextProps & RNTextProps

const ColoredText = styled(RNText)<TextProps>(({ color }) => ({
  color: color ?? ColorsEnum.BLACK,
}))

const Hero = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(9.5),
  lineHeight: getSpacingString(12),
})

const Title1: React.FC<TextProps> = (props) => {
  const grid = useGrid()
  const fontSize = getSpacing(grid({ default: 7, sm: 6 }, 'height'))
  return (
    <StyledTitle1 {...props} fontSize={fontSize}>
      {props.children}
    </StyledTitle1>
  )
}

const StyledTitle1 = styled(ColoredText)<{ fontSize: number }>((props) => ({
  fontFamily: 'Montserrat-Black',
  fontSize: props.fontSize,
  lineHeight: getSpacingString(9),
}))

const Title2: React.FC<TextProps> = (props) => {
  const grid = useGrid()
  const fontSize = getSpacing(grid({ default: 6, sm: 5.5 }, 'height'))
  return (
    <StyledTitle2 {...props} fontSize={fontSize}>
      {props.children}
    </StyledTitle2>
  )
}
const StyledTitle2 = styled(ColoredText)<{ fontSize: number }>((props) => ({
  fontFamily: 'Montserrat-Medium',
  fontSize: props.fontSize,
  lineHeight: getSpacingString(7),
}))

const Title3 = styled(ColoredText)({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(5),
  lineHeight: getSpacingString(6),
})

const Title4 = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(4.5),
  lineHeight: getSpacingString(5.5),
})

const ButtonText = styled(ColoredText)<{ shrink?: boolean }>(({ shrink }) => ({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(3.75),
  ...(!shrink ? { lineHeight: getSpacingString(5) } : { flexShrink: 1 }),
}))

const Body = styled(ColoredText)({
  fontFamily: 'Montserrat-Regular',
  fontSize: getSpacing(3.75),
  lineHeight: getSpacingString(5),
})

const Caption = styled(ColoredText)({
  fontFamily: 'Montserrat-SemiBold',
  fontSize: getSpacing(3),
  lineHeight: getSpacingString(4),
})

export const Typo = {
  Hero,
  Title1,
  Title2,
  Title3,
  Title4,
  ButtonText,
  Body,
  Caption,
}
