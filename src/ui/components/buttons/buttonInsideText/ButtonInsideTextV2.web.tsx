import React, { MouseEventHandler, useCallback } from 'react'
import styled, { CSSObject, DefaultTheme } from 'styled-components'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import {
  AppButtonEventWeb,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextV2Props } from 'ui/components/buttons/buttonInsideText/types'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export function ButtonInsideTextV2({
  wording,
  typography = 'Button',
  onPress,
  onLongPress,
  href,
  target,
  type = AccessibilityRole.BUTTON,
  accessibilityLabel,
  color,
}: ButtonInsideTextV2Props) {
  const Text = (href ? Link : Button) as React.ElementType

  const pressHandler = onPress as AppButtonEventWeb
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (pressHandler) pressHandler(event)
    },
    [pressHandler]
  )

  const longPressHandler = onLongPress as AppButtonEventWeb
  const onDoubleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (longPressHandler) longPressHandler(event)
    },
    [longPressHandler]
  )

  return (
    <Text
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type={href ? undefined : type}
      href={href}
      target={target}
      accessibilityLabel={accessibilityLabel}
      typography={typography}
      color={color}>
      {wording}
    </Text>
  )
}

const webStyle = ({
  theme,
  typography,
  color,
}: {
  theme: DefaultTheme
  typography?: string
  color?: ColorsType
}) =>
  ({
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    width: 'fit-content',
    margin: 0,
    padding: 0,
    textDecoration: 'underline',
    color: color ?? theme.designSystem.color.text.brandPrimary,
    ...customFocusOutline({ color: color ?? theme.designSystem.color.text.brandPrimary }),
    ...(typography === 'BodyAccentXs'
      ? theme.designSystem.typography.bodyAccentXs
      : theme.designSystem.typography.button),
  }) as CSSObject

const Button = styled.button<TouchableOpacityButtonProps & Pick<ButtonInsideTextV2Props, 'color'>>(
  webStyle
)

const Link = styled.a<TouchableOpacityButtonProps & Pick<ButtonInsideTextV2Props, 'color'>>(
  webStyle
)
