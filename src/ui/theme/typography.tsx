import React from 'react'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from 'styled-components/native'

import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ColorsEnum, UniqueColors } from './colors'
import { useGrid } from './grid'
import { getSpacing } from './spacing'

interface CustomTextProps {
  color?: ColorsEnum | UniqueColors
}
export type TextProps = CustomTextProps & RNTextProps

const Hero = styled(RNText)(({ theme }) => ({
  ...theme.typography.hero,
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
}))

const Title3 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 3)
)(({ theme }) => ({
  ...theme.typography.title3,
}))

const Title4 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 4)
)(({ theme }) => ({
  ...theme.typography.title4,
}))

const ButtonText = styled(RNText)<{ shrink?: boolean }>(({ shrink, theme }) => ({
  fontFamily: theme.typography.buttonText.fontFamily,
  fontSize: theme.typography.buttonText.fontSize,
  color: theme.typography.buttonText.color,
  ...(!shrink ? { lineHeight: theme.typography.buttonText.lineHeight } : { flexShrink: 1 }),
}))

const ButtonTextPrimary = styled(ButtonText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const ButtonTextNeutralInformation = styled(ButtonText)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
const ButtonTextSecondary = styled(ButtonText)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Body = styled(RNText)(({ theme }) => ({
  ...theme.typography.body,
}))

const Caption = styled(RNText)(({ theme }) => ({
  ...theme.typography.caption,
}))

const CaptionPrimary = styled(Caption)(({ theme }) => ({
  color: theme.colors.primary,
}))

const CaptionSecondary = styled(Caption)(({ theme }) => ({
  color: theme.colors.secondary,
}))

export const Typo = {
  Hero,
  Title1,
  Title2,
  Title3,
  Title4,
  ButtonText,
  ButtonTextNeutralInformation,
  ButtonTextPrimary,
  ButtonTextSecondary,
  Body,
  Caption,
  CaptionPrimary,
  CaptionSecondary,
}
