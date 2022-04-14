import { useLinkProps } from '@react-navigation/native'
import React from 'react'
import styled, { CSSObject } from 'styled-components'

import {
  AppButtonEventNative,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'

export function ButtonInsideText({
  wording,
  type,
  onPress,
  onLongPress,
  icon: Icon,
  color,
  to,
  externalHref,
}: ButtonInsideTexteProps) {
  const ButtonComponent = (to || externalHref ? Link : Button) as React.ElementType
  const internalLinkProps = useLinkProps({ to: to ?? '' })
  const externalLinkProps = { href: externalHref, accessibilityRole: 'link', target: '_blank' }
  const linkProps = externalHref ? externalLinkProps : internalLinkProps
  const buttonLinkProps = externalHref || to ? { ...linkProps, type: undefined } : {}

  return (
    <ButtonComponent
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}
      {...buttonLinkProps}>
      <ButtonInsideTextInner wording={wording} icon={Icon} color={color} type={type} />
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
