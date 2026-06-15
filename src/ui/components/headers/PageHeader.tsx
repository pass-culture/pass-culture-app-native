import React from 'react'
import styled from 'styled-components/native'

import { ServerErrorTag } from 'shared/ServerErrorTag/ServerErrorTag'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  numberOfLines?: number
  subtitle?: string
  children?: React.ReactNode
  withMargins?: boolean
  hasServerError?: boolean
}

export const PageHeader = ({
  title,
  numberOfLines = 1,
  subtitle,
  withMargins = false,
  hasServerError = false,
  children,
}: Props) => {
  return (
    <React.Fragment>
      {withMargins ? <Spacer.TopScreen /> : null}
      <HeaderContainer withMargins={withMargins}>
        {hasServerError ? <ServerErrorTag /> : null}
        <TitleContainer>
          <TitleText numberOfLines={numberOfLines}>{title}</TitleText>
          {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
        </TitleContainer>
        {children}
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View<{ withMargins?: boolean }>(({ theme, withMargins }) => ({
  flexDirection: 'row',
  marginTop: withMargins ? theme.designSystem.size.spacing.xl : 0,
  marginHorizontal: withMargins ? theme.contentPage.marginHorizontal : 0,
  justifyContent: 'space-between',
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
