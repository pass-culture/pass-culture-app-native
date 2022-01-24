import React, { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  className?: string
}

export function Ul(props: Props) {
  return <StyledUl className={props.className}>{props.children}</StyledUl>
}

const StyledUl = styled.ul`
  display: flex;
  padding-left: 0;
`
