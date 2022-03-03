import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { Background } from 'ui/svg/Background'
import { getSpacing } from 'ui/theme'

export const ContainerWithBackgound = ({ children }: { children: ReactNode }) => (
  <Container>
    <Background />
    {children}
  </Container>
)

const padding = getSpacing(5)
const Container = styled.View(({ theme }) => ({
  padding,
  alignSelf: 'flex-start',
  minWidth: theme.contentPage.maxWidth + padding * 2,
}))
