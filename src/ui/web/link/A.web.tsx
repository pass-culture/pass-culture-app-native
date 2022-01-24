import React, { ReactNode, useCallback } from 'react'
import { GestureResponderEvent } from 'react-native'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  href?: string
  className?: string
  target?: '_blank' | '_parent' | '_top'
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
}

export function A(props: Props) {
  const onClick = useCallback(
    (event) => {
      event.preventDefault()
      if (props.onPress) {
        props.onPress(event)
      }
    },
    [props.onPress]
  )
  return (
    <StyledA href={props.href} className={props.className} target={props.target} onClick={onClick}>
      {props.children}
    </StyledA>
  )
}

const StyledA = styled.a`
  text-decoration: none;
`
