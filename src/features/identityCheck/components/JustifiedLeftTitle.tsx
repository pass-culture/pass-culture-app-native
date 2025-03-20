import React from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const JustifiedLeftTitle = ({ title, titleID }: { title: string; titleID?: string }) => (
  <TitleContainer>
    <Title nativeID={titleID}>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View({
  alignItems: 'flex-start',
  width: '100%',
  marginBottom: getSpacing(8),
})

const Title = styled(Typo.Title3).attrs(() => getHeadingAttrs(2))({})
