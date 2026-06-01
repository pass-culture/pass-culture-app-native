import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

type Props = {
  title: string
  numberOfLines?: number
  subtitle?: string
  children?: React.ReactNode
}

export const PageHeader = ({ title, numberOfLines = 1, subtitle, children }: Props) => {
  return (
    <React.Fragment>
      <HeaderContainer>
        <TitleContainer>
          <TitleText numberOfLines={numberOfLines}>{title}</TitleText>
          {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
        </TitleContainer>
        {children}
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.designSystem.size.spacing.xl,
  marginHorizontal: theme.contentPage.marginHorizontal,
  zIndex: theme.zIndex.header,
}))

const TitleContainer = styled.View({
  flexShrink: 1,
})

const TitleText = styled(Typo.Title1)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xs,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
