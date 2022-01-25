import React, { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  liveType: 'polite' | 'assertive' | 'off'
  children: ReactNode
}

export function AriaLive(props: Props) {
  return <StyledAriaLive aria-live={props.liveType}>{props.children}</StyledAriaLive>
}

const StyledAriaLive = styled.div`
  height: 0;
  overflow: hidden;
`
