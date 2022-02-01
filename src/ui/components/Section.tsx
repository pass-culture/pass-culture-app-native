import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

import { Separator } from './Separator'

type SectionProps = PropsWithChildren<{
  title?: string
}>

export function Section(props: SectionProps) {
  return (
    <Container>
      {!!props.title && <StyledCaption>{props.title}</StyledCaption>}
      <Spacer.Column numberOfSpaces={2} />
      <Separator />
      {props.children}
    </Container>
  )
}

const Container = styled.View({
  paddingTop: getSpacing(2),
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
