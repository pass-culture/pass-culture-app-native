import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const CenteredSection: React.FC<{ title: string; children: Element }> = ({
  title,
  children,
}) => (
  <React.Fragment>
    <Typo.Title4>{title}</Typo.Title4>
    <Center>{children}</Center>
  </React.Fragment>
)

const Center = styled.View({ alignItems: 'center', marginTop: getSpacing(4) })
