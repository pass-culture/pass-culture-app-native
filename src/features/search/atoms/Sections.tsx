import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

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
      <Spacer.Row numberOfSpaces={7} />
      {children}
    </InlineSectionTitleContainer>
    {subtitle && (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Caption color={ColorsEnum.GREY_DARK}>{subtitle}</Typo.Caption>
      </React.Fragment>
    )}
  </SectionContainer>
)

const SectionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const InlineSectionTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTitle = styled(Typo.Title4)({ flex: 1 })
