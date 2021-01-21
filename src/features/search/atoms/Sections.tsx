import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

import { TitleWithCount } from './TitleWithCount'

export const CenteredSection: React.FC<{ title: string; children: Element }> = ({
  title,
  children,
}) => (
  <Container>
    <Typo.Title4>{title}</Typo.Title4>
    <Center>{children}</Center>
  </Container>
)

export const Section: React.FC<{ title: string; count: number; children: Element }> = ({
  title,
  count,
  children,
}) => (
  <Container>
    <TitleWithCount title={title} count={count} />
    <Spacer.Column numberOfSpaces={4} />
    {children}
  </Container>
)

export const InlineSection: React.FC<{
  title: Element | string
  subtitle?: string
  children: Element
}> = ({ title, subtitle, children }) => (
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

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Center = styled.View({ alignItems: 'center', marginTop: getSpacing(4) })

const SectionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const InlineSectionTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTitle = styled(Typo.Title4)({ flex: 1 })
