/* eslint-disable react-native/no-raw-text */
import React from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type Props = {
  accessibilityLabel?: string
  withSpaceBefore?: boolean
  withSpaceAfter?: boolean
  children?: string
  style?: StyleProp<TextStyle>
}

const nonBreakingSpace = '\u00a0'

const Container: React.FC<Props> = ({
  accessibilityLabel,
  withSpaceBefore,
  withSpaceAfter,
  children,
  style,
}) => {
  return (
    <Text
      style={style}
      accessibilityRole={AccessibilityRole.IMAGE}
      accessibilityLabel={accessibilityLabel}
      aria-hidden={!accessibilityLabel}>
      {withSpaceBefore && nonBreakingSpace}
      {children}
      {withSpaceAfter && nonBreakingSpace}
    </Text>
  )
}

const CryingFace = (props: Props) => <Container {...props}>😢</Container>
const Warning = (props: Props) => <Container {...props}>⚠️</Container>

export const Emoji = {
  CryingFace,
  Warning,
}
