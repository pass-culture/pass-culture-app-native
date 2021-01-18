import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const CenteredSection: React.FC<{ title: string; children: Element }> = ({
  title,
  children,
}) => (
  <Container>
    <Typo.Title4>{title}</Typo.Title4>
    <Center>{children}</Center>
  </Container>
)

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Center = styled.View({ alignItems: 'center', marginTop: getSpacing(4) })
