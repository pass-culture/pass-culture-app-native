import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const CenteredTitle = ({ title }: { title: string }) => {
  return (
    <TitleContainer>
      <Typo.Title4>{title}</Typo.Title4>
    </TitleContainer>
  )
}

const TitleContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  padding: getSpacing(5),
})
