import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

export const CenteredTitle = ({ title }: { title: string }) => (
  <TitleContainer>
    <Title>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
