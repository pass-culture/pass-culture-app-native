import React, { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  className?: string
}

function MaxWidth(props: Props) {
  return <StyledFormMaxWidth className={props.className}>{props.children}</StyledFormMaxWidth>
}

function Flex(props: Props) {
  return <StyledFormFlex className={props.className}>{props.children}</StyledFormFlex>
}

const StyledFormMaxWidth = styled.form`
  ${({ theme }) => `
    width: 100%;
    max-width: ${theme.forms.maxWidth};
  `}
`

const StyledFormFlex = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const Form = { Flex, MaxWidth }
