import React, { MouseEventHandler, useCallback } from 'react'
import styled, { CSSObject, DefaultTheme } from 'styled-components'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import {
  AppButtonEventWeb,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
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
}: ButtonInsideTexteProps) {
  const Text = (href ? Link : Button) as React.ElementType

  const pressHandler = onPress as AppButtonEventWeb
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (type === 'submit' && pressHandler) event.preventDefault()
      if (pressHandler) pressHandler(event)
    },
    [type, pressHandler]
  )

  const longPressHandler = onLongPress as AppButtonEventWeb
  const onDoubleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (type === 'submit' && longPressHandler) event.preventDefault()
      if (longPressHandler) longPressHandler(event)
    },
    [type, longPressHandler]
  )

  return (
    <Text
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type={href ? undefined : type}
      href={href}
      target={target}
      accessibilityLabel={accessibilityLabel}
      typography={typography}>
      {wording}
    </Text>
  )
}

const webStyle = ({ theme, typography }: { theme: DefaultTheme; typography?: string }) =>
  ({
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    width: 'fit-content',
    margin: 0,
    padding: 0,
    color: theme.designSystem.color.text.brandPrimary,
    ...customFocusOutline({ color: theme.designSystem.color.text.brandPrimary }),
    ...(typography === 'BodyAccentXs'
      ? theme.designSystem.typography.bodyAccentXs
      : theme.designSystem.typography.button),
  }) as CSSObject

const Button = styled.button<
  TouchableOpacityButtonProps & Pick<ButtonInsideTexteProps, 'buttonColor'>
>(webStyle)

const Link = styled.a<TouchableOpacityButtonProps & Pick<ButtonInsideTexteProps, 'buttonColor'>>(
  webStyle
)
