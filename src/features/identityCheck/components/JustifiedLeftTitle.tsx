import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const JustifiedLeftTitle = ({ title, titleID }: { title: string; titleID?: string }) => (
  <TitleContainer>
    <Title nativeID={titleID}>{title}</Title>
  </TitleContainer>
)

const TitleContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const Title = styled(Typo.Title3).attrs(() => getHeadingAttrs(2))({})
