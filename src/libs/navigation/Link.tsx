import { NavigationAction, Link as DefaultLink } from '@react-navigation/native'
import React from 'react'
import { GestureResponderEvent, TextProps } from 'react-native'

declare type Props = {
  to: string
  action?: NavigationAction
  target?: string
  onPress?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void
} & (TextProps & {
  children: React.ReactNode
}) & {
    params?: string | string[][] | Record<string, unknown> | URLSearchParams
  }

export const Link = function Link({ to, action, target, onPress, children, params }: Props) {
  const searchParams = new URLSearchParams(params as Record<string, string>)

  return (
    <DefaultLink
      to={`${to.startsWith('/') ? to : `/${to}`}${params ? `?${searchParams.toString()}` : ''}`}
      action={action}
      target={target}
      onPress={onPress}>
      {children}
    </DefaultLink>
  )
}
