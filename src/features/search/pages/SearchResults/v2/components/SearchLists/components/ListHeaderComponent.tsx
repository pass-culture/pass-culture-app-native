import React, { FC } from 'react'
import styled from 'styled-components/native'

import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { Typo } from 'ui/theme'

export const ListHeaderComponent: FC<{ title: string; nbItems: number }> = ({ title, nbItems }) => (
  <HeaderSectionContainer>
    <TitleContainer>
      <Title>{title}</Title>
      <NumberOfItems nbItems={nbItems} />
    </TitleContainer>
  </HeaderSectionContainer>
)

const HeaderSectionContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
})

const Title = styled(Typo.Title3)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
