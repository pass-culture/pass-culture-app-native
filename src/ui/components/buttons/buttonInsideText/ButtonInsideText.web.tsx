import React, { MouseEventHandler, useCallback } from 'react'
import styled, { CSSObject } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import {
  AppButtonEventWeb,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export function ButtonInsideText({
  wording,
  typography,
  onPress,
  onLongPress,
  icon: Icon,
  buttonColor,
  accessibilityRole,
  href,
  target,
  type = 'button',
  testID,
}: ButtonInsideTexteProps) {
  const ButtonComponent = (href ? Link : Button) as React.ElementType
  const buttonLinkProps = { accessibilityRole, href, target }

  const pressHandler = onPress as AppButtonEventWeb
  const longPressHandler = onLongPress as AppButtonEventWeb

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (type === 'submit' && pressHandler) {
        event.preventDefault()
      }
      if (pressHandler) {
        pressHandler(event)
      }
    },
    [type, pressHandler]
  )

  const onDoubleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if ((type === 'submit' || href) && longPressHandler) {
        event.preventDefault()
      }
      if (longPressHandler) {
        longPressHandler(event)
      }
    },
    [type, href, longPressHandler]
  )

  return (
    <ButtonComponent
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type={href ? undefined : type}
      buttonColor={buttonColor}
      testID={testID || 'button-inside-text'}
      {...buttonLinkProps}>
      <ButtonInsideTextInner
        wording={wording}
        icon={Icon}
        color={buttonColor}
        typography={typography}
      />
    </ButtonComponent>
  )
}

const webStyle = ({
  theme,
  buttonColor,
}: {
  theme: DefaultTheme
  buttonColor?: ButtonInsideTexteProps['buttonColor']
}) =>
  ({
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    textDecoration: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    width: 'fit-content',
    margin: 0,
    padding: 0,
    ...customFocusOutline({ color: buttonColor ?? theme.colors.primary, noOffset: true }),
    ...getHoverStyle(buttonColor ?? theme.colors.primary),
  } as CSSObject)

const Button = styled.button.attrs<Pick<ButtonInsideTexteProps, 'testID'>>(({ testID }) => ({
  ['data-testid']: testID,
}))<TouchableOpacityButtonProps & Pick<ButtonInsideTexteProps, 'buttonColor'>>(webStyle)
const Link = styled.a.attrs<Pick<ButtonInsideTexteProps, 'testID'>>(({ testID }) => ({
  ['data-testid']: testID,
}))<TouchableOpacityButtonProps & Pick<ButtonInsideTexteProps, 'buttonColor'>>(webStyle)
