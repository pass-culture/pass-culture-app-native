import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const CenteredSection: React.FC<{ title: string; children: Element }> = ({
  title,
  children,
}) => (
  <Container>
    <Typo.Title4>{title}</Typo.Title4>
    <Center>{children}</Center>
  </Container>
)

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Center = styled.View({ alignItems: 'center', marginTop: getSpacing(4) })

export const InlineSection: React.FC<{ title: string; subtitle?: string; children: Element }> = ({
  title,
  subtitle,
  children,
}) => (
  <SectionContainer>
    <InlineSectionTitleContainer>
      <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      {children}
    </InlineSectionTitleContainer>
    <StyledSubtitle>{subtitle}</StyledSubtitle>
  </SectionContainer>
)

const SectionContainer = styled.View({
  marginTop: getSpacing(4),
  marginHorizontal: getSpacing(6),
})

const InlineSectionTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTitle = styled(Typo.Title4)({ flex: 1, marginRight: getSpacing(7) })
const StyledSubtitle = styled(Typo.Caption).attrs({
  color: ColorsEnum.GREY_DARK,
})({ marginTop: getSpacing(2) })
