import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
  numberOfLines?: 1 | 2
}

export const Title = ({ title, numberOfLines = 1 }: Props) => {
  return (
    <TitleContainer>
      <Typo.Title1 numberOfLines={numberOfLines}>{title}</Typo.Title1>
    </TitleContainer>
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))
