import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

export const CenteredTitle = ({ title, titleID }: { title: string; titleID?: string }) => (
  <TitleContainer>
    <Title nativeID={titleID}>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const Title = styled(Typo.Title4).attrs(() => getTextSemanticAttrs(2))({
  textAlign: 'center',
})
