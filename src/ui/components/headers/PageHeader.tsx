import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  numberOfLines?: 1 | 2
  subtitle?: string
  children?: React.ReactNode
}

export const PageHeader = ({ title, numberOfLines = 1, subtitle, children }: Props) => {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <TitleContainer gap={1}>
          <TitleText numberOfLines={numberOfLines}>{title}</TitleText>
          {subtitle ? <CaptionSubtitle>{subtitle}</CaptionSubtitle> : null}
        </TitleContainer>
        {children}
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  justifyContent: 'space-between',
  zIndex: theme.zIndex.header,
}))

const TitleContainer = styled.View({
  flexShrink: 1,
})

const TitleText = styled(Typo.Title1)({
  marginBottom: getSpacing(1),
})

const CaptionSubtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
