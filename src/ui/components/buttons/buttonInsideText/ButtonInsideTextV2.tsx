import React from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextV2Props } from 'ui/components/buttons/buttonInsideText/types'
import { Typo } from 'ui/theme'

export function ButtonInsideTextV2({
  wording,
  typography = 'Button',
  onPress,
  onLongPress,
  accessibilityLabel,
  color,
  type = AccessibilityRole.BUTTON,
}: ButtonInsideTextV2Props) {
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
