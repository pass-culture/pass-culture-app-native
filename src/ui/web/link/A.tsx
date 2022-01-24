import React, { ReactNode } from 'react'
import { GestureResponderEvent } from 'react-native'

type Props = {
  children: ReactNode
  href?: string
  className?: string
  target?: string
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
}

export function A(props: Props) {
  return <React.Fragment>{props.children}</React.Fragment>
}
