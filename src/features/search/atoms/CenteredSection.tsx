import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CenteredSection: React.FC<{
  title: JSX.Element | string
  children: JSX.Element | Array<JSX.Element | null>
}> = ({ title, children }) => (
  <MarginHorizontalContainer>
    <Title>{title}</Title>
    <Spacer.Column numberOfSpaces={4} />
    <Center>{children}</Center>
  </MarginHorizontalContainer>
)

const Center = styled.View({ alignItems: 'center' })
const MarginHorizontalContainer = styled.View({ marginHorizontal: getSpacing(6) })

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(2))``
