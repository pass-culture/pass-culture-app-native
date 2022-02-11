import React from 'react'
import { AccessibilityRole, Platform, Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, UniqueColors } from './colors'
import { useGrid } from './grid'
import { getSpacing } from './spacing'

interface CustomTextProps {
  color?: ColorsEnum | UniqueColors
}
type TextProps = CustomTextProps & RNTextProps

export const getHeadingAttrs = (level: number) => ({
  ...(Platform.OS === 'web'
    ? {
        accessibilityRole: 'header' as AccessibilityRole,
        'aria-level': level,
      }
    : {}),
})

const Hero = styled(RNText)(({ theme }) => ({
  ...theme.typography.hero,
  color: theme.colors.black,
}))

const Title1: React.FC<TextProps> = (props) => {
  const grid = useGrid()
  const fontSize = getSpacing(grid({ default: 7, sm: 6 }, 'height'))
  return (
    <StyledTitle1 {...getHeadingAttrs(1)} {...props} fontSize={fontSize}>
      {props.children}
    </StyledTitle1>
  )
}

const StyledTitle1 = styled(RNText)<{
  fontSize: number
}>(({ fontSize, theme }) => ({
  ...theme.typography.title1,
  fontSize: fontSize ?? theme.typography.title1.fontSize,
  color: theme.colors.black,
}))

const Title2: React.FC<TextProps> = (props) => {
  const grid = useGrid()
  const fontSize = getSpacing(grid({ default: 6, sm: 5.5 }, 'height'))
  return (
    <StyledTitle2 {...getHeadingAttrs(2)} {...props} fontSize={fontSize}>
      {props.children}
    </StyledTitle2>
  )
}
const StyledTitle2 = styled(RNText)<{
  fontSize: number
}>(({ fontSize, theme }) => ({
  ...theme.typography.title2,
  fontSize: fontSize ?? theme.typography.title2.fontSize,
  color: theme.colors.black,
}))

const Title3 = styled(RNText).attrs(() => getHeadingAttrs(3))(({ theme }) => ({
  ...theme.typography.title3,
  color: theme.colors.black,
}))

const Title4 = styled(RNText).attrs(() => getHeadingAttrs(4))(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.black,
}))

const ButtonText = styled(RNText)<{ shrink?: boolean }>(({ shrink, theme }) => ({
  fontFamily: theme.typography.buttonText.fontFamily,
  fontSize: theme.typography.buttonText.fontSize,
  color: theme.colors.black,
  ...(!shrink ? { lineHeight: theme.typography.buttonText.lineHeight } : { flexShrink: 1 }),
}))

const Body = styled(RNText)(({ theme }) => ({
  ...theme.typography.body,
  color: theme.colors.black,
}))

const Caption = styled(RNText)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.black,
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
