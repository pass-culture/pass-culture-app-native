import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const CenteredTitle = ({ title }: { title: string }) => (
  <TitleContainer>
    <Title>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  paddingVertical: getSpacing(5),
})

const Title = styled(Typo.Title4)({ textAlign: 'center' })
