import { useLinkProps } from '@react-navigation/native'
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
  to,
  externalHref,
  type = 'button',
}: ButtonInsideTexteProps) {
  const ButtonComponent = (to || externalHref ? Link : Button) as React.ElementType
  const internalLinkProps = useLinkProps({ to: to ?? '' })
  const externalLinkProps = { href: externalHref, accessibilityRole: 'link', target: '_blank' }
  const linkProps = externalHref ? externalLinkProps : internalLinkProps
  const buttonLinkProps = externalHref || to ? { ...linkProps, type: undefined } : {}

  const pressHandler = onPress as AppButtonEventWeb
  const longPressHandler = onLongPress as AppButtonEventWeb

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if ((type === 'submit' || to || externalHref) && pressHandler) {
        event.preventDefault()
      }
      if (pressHandler) {
        pressHandler(event)
      }
    },
    [type, to, externalHref, pressHandler]
  )

  const onDoubleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if ((type === 'submit' || to || externalHref) && longPressHandler) {
        event.preventDefault()
      }
      if (longPressHandler) {
        longPressHandler(event)
      }
    },
    [type, to, externalHref, longPressHandler]
  )

  return (
    <ButtonComponent
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-testid="button-inside-text"
      {...buttonLinkProps}>
      <ButtonInsideTextInner wording={wording} icon={Icon} color={color} typography={typography} />
    </ButtonComponent>
  )
}

const webStyle = {
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  textDecoration: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  margin: 0,
  padding: 0,
} as CSSObject

const Button = styled.button<TouchableOpacityButtonProps>(webStyle)
const Link = styled.a<TouchableOpacityButtonProps>(webStyle)
