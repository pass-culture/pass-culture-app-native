import { Text as RNText } from 'react-native'
import styled from 'styled-components/native'

import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

// Remove DS after merged with the new typo from design-system

const Title1 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 1)
)(({ theme }) => ({
  ...theme.designSystem.typography.title1,
}))

const Title2 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 2)
)(({ theme }) => ({
  ...theme.designSystem.typography.title2,
}))

const Title3 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 3)
)(({ theme }) => ({
  ...theme.designSystem.typography.title3,
}))

const Title4 = styled(RNText).attrs<{ accessibilityLevel: HeadingLevel }>(
  ({ accessibilityLevel }) => getHeadingAttrs(accessibilityLevel ?? 4)
)(({ theme }) => ({
  ...theme.designSystem.typography.title4,
}))

const Body = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.body,
}))

const BodyS = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodyS,
}))

const BodyXs = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodyXs,
}))

const BodySemiBold = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodySemiBold,
}))

const BodySemiBoldS = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodySemiBoldS,
}))

const BodySemiBoldXs = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodySemiBoldXs,
}))

const BodyItalic = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodyItalic,
}))

const BodySemiBoldItalic = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.bodyItalic,
}))

const Button = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.button,
}))

const Link = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.button,
}))

const Caption = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.caption,
}))

const Hint = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.hint,
}))

const Placeholder = styled(RNText)(({ theme }) => ({
  ...theme.designSystem.typography.placeholder,
}))

export const TypoDS = {
  Title1,
  Title2,
  Title3,
  Title4,
  Body,
  BodyS,
  BodyXs,
  BodySemiBold,
  BodySemiBoldS,
  BodySemiBoldXs,
  BodyItalic,
  BodySemiBoldItalic,
  Button,
  Link,
  Caption,
  Hint,
  Placeholder,
}
