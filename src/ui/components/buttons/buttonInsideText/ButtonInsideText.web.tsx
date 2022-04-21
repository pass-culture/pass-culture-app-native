import React, { MouseEventHandler, useCallback } from 'react'
import styled, { CSSObject } from 'styled-components'

import {
  AppButtonEventWeb,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'

export function ButtonInsideText({
  wording,
  typography,
  onPress,
  onLongPress,
  icon: Icon,
  color,
  accessibilityRole,
  href,
  target,
  type = 'button',
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
      if (type === 'submit' && longPressHandler) {
        event.preventDefault()
      }
      if (longPressHandler) {
        longPressHandler(event)
      }
    },
    [type, longPressHandler]
  )

  return (
    <ButtonComponent
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      type={href ? undefined : type}
      data-testid="button-inside-text"
      {...buttonLinkProps}>
      <ButtonInsideTextInner wording={wording} icon={Icon} color={color} typography={typography} />
    </ButtonComponent>
  )
}

const webStyle = {
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  textDecoration: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  width: 'fit-content',
  margin: 0,
  padding: 0,
} as CSSObject

const Button = styled.button<TouchableOpacityButtonProps>(webStyle)
const Link = styled.a<TouchableOpacityButtonProps>(webStyle)
