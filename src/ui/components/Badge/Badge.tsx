import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  value: number
  testID?: string
  children?: never
}

export const Badge: FunctionComponent<Props> = ({ value, ...props }) => (
  <Container {...props}>
    <Wrapper>
      <Caption>{value}</Caption>
    </Wrapper>
  </Container>
)

const Container = styled.View(({ theme }) => ({
  alignSelf: 'center',
  borderWidth: getSpacing(0.25),
  borderStyle: 'solid',
  borderColor: theme.colors.white,
  borderRadius: getSpacing(3),
  backgroundColor: theme.colors.primary,
}))

const Wrapper = styled.View({
  minWidth: getSpacing(4),
  height: getSpacing(4),
  paddingHorizontal: getSpacing(0.5),
})

const Caption = styled(Typo.Caption)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
