import React from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { LinkInsideTextProps } from 'ui/components/buttons/linkInsideText/types'
import { Typo } from 'ui/theme'

export function LinkInsideText({
  wording,
  typography = 'Button',
  onPress,
  onLongPress,
  accessibilityLabel,
  color,
  type = AccessibilityRole.BUTTON,
}: LinkInsideTextProps) {
  const Text = typography === 'BodyAccentXs' ? StyledBodyAccentXs : StyledBody
  const accessibilityLabelLink = type === AccessibilityRole.LINK ? ', lien externe' : ''
  const computedAccessibilityLabel = `${accessibilityLabel ?? wording}${accessibilityLabelLink}`

  return (
    <Text
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}
      accessibilityRole={type}
      accessibilityLabel={computedAccessibilityLabel}
      color={color}>
      {wording}
    </Text>
  )
}

const commonTextStyle = { textDecorationLine: 'underline', cursor: 'pointer' }
const withDefaultColor = (props: { color?: ColorsType; theme: DefaultTheme }) => ({
  color: props.color ?? props.theme.designSystem.color.icon.brandPrimary,
})

const StyledBody = styled(Typo.Button)<{ color?: ColorsType }>((props) => ({
  ...withDefaultColor(props),
  ...commonTextStyle,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)<{ color?: ColorsType }>((props) => ({
  ...withDefaultColor(props),
  ...commonTextStyle,
}))
