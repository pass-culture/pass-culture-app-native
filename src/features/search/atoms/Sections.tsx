import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { TitleWithCount } from './TitleWithCount'

export const CenteredSection: React.FC<{
  title: JSX.Element | string
  children: JSX.Element | Array<JSX.Element | null>
}> = ({ title, children }) => (
  <MarginHorizontalContainer>
    <Typo.Title4>{title}</Typo.Title4>
    <Spacer.Column numberOfSpaces={4} />
    <Center>{children}</Center>
  </MarginHorizontalContainer>
)

export const Section: React.FC<{
  title: string
  count: number
  children: JSX.Element | Array<JSX.Element | null>
}> = ({ title, count, children }) => (
  <MarginHorizontalContainer>
    <TitleWithCount title={title} count={count} />
    <Spacer.Column numberOfSpaces={4} />
    {children}
  </MarginHorizontalContainer>
)

export const InlineSection: React.FC<{
  title: JSX.Element | string
  subtitle?: string
  children: JSX.Element | Array<JSX.Element | null>
  testID?: string
}> = ({ title, subtitle, children, testID }) => (
  <MarginHorizontalContainer testID={testID}>
    <InlineSectionTitleContainer>
      <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      {children}
    </InlineSectionTitleContainer>
    {!!subtitle && (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Caption color={ColorsEnum.GREY_DARK}>{subtitle}</Typo.Caption>
      </React.Fragment>
    )}
  </MarginHorizontalContainer>
)

const Center = styled.View({ alignItems: 'center' })
const MarginHorizontalContainer = styled.View({ marginHorizontal: getSpacing(6) })

const InlineSectionTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTitle = styled(Typo.Title4)(({ theme }) => ({
  flex: theme.isMobileViewport ? 1 : undefined,
}))
