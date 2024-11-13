import React from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CenteredTitle = ({ title, titleID }: { title: string; titleID?: string }) => (
  <TitleContainer>
    <Title nativeID={titleID}>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const Title = styled(TypoDS.Title4).attrs(() => getHeadingAttrs(2))({
  textAlign: 'center',
})
