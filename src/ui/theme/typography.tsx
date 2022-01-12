import React from 'react'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, UniqueColors } from './colors'
import { useGrid } from './grid'
import { getSpacing } from './spacing'

interface CustomTextProps {
  color?: ColorsEnum | UniqueColors
}
type TextProps = CustomTextProps & RNTextProps

const ColoredText = styled(RNText)<TextProps>(({ color, theme }) => ({
  color: color ?? theme.colors.black,
}))

const Hero = styled(ColoredText)(({ theme }) => ({
  ...theme.typography.hero,
}))

const Title1: React.FC<TextProps> = (props) => {
  const grid = useGrid()
  const fontSize = getSpacing(grid({ default: 7, sm: 6 }, 'height'))
  return (
    <StyledTitle1 {...props} fontSize={fontSize}>
      {props.children}
    </StyledTitle1>
  )
}

const StyledTitle1 = styled(ColoredText)<{ fontSize: number }>(({ fontSize, theme }) => ({
  ...theme.typography.title1,
  fontSize: fontSize ?? theme.typography.title1.fontSize,
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
const StyledTitle2 = styled(ColoredText)<{ fontSize: number }>(({ fontSize, theme }) => ({
  ...theme.typography.title2,
  fontSize: fontSize ?? theme.typography.title2.fontSize,
}))

const Title3 = styled(ColoredText)(({ theme }) => ({
  ...theme.typography.title3,
}))

const Title4 = styled(ColoredText)(({ theme }) => ({
  ...theme.typography.title4,
}))

const ButtonText = styled(ColoredText)<{ shrink?: boolean }>(({ shrink, theme }) => ({
  fontFamily: theme.typography.buttonText.fontFamily,
  fontSize: theme.typography.buttonText.fontSize,
  ...(!shrink ? { lineHeight: theme.typography.buttonText.lineHeight } : { flexShrink: 1 }),
}))

const Body = styled(ColoredText)(({ theme }) => ({
  ...theme.typography.body,
}))

const Caption = styled(ColoredText)(({ theme }) => ({
  ...theme.typography.caption,
}))

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
