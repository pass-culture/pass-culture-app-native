/* eslint-disable local-rules/no-raw-text */
import React, { ReactElement } from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type Props = {
  accessibilityLabel?: string
  withSpaceBefore?: boolean
  withSpaceAfter?: boolean
  children?: ReactElement | string
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

const BoldContainer = styled(Container)({
  fontFamily: 'Montserrat-SemiBold',
})

const CryingFace = (props: Props) => <Container {...props}>😢</Container>

// For mysterious reasons, some emojis like the warning emoji are sometimes displayed in black and white by the chrome browser.
// To fix this issue, those emojis should be rendered with a bold fontFamily as following :
const Warning = (props: Props) => <BoldContainer {...props}>⚠️</BoldContainer>

export const Emoji = {
  CryingFace,
  Warning,
}
