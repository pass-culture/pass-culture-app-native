import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from 'styled-components/native'

import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ColorsEnum, UniqueColors } from './colors'

interface CustomTextProps {
  color?: ColorsEnum | UniqueColors
}
export type TextProps = CustomTextProps & RNTextProps

const Hero = styled(RNText)(({ theme }) => ({
  ...theme.typography.hero,
}))

const Title1 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 1)
)(({ theme }) => ({
  ...theme.typography.title1,
}))

const Title2 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 2)
)(({ theme }) => ({
  ...theme.typography.title2,
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

const ButtonTextNeutralInfo = styled(ButtonText)(({ theme }) => ({
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

export const CaptionNeutralInfo = styled(Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

export const Typo = {
  Hero,
  Title1,
  Title2,
  Title3,
  Title4,
  ButtonText,
  ButtonTextNeutralInfo,
  ButtonTextPrimary,
  ButtonTextSecondary,
  Body,
  Caption,
  CaptionPrimary,
  CaptionSecondary,
  CaptionNeutralInfo,
}
