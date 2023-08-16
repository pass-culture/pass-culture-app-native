import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Typo } from 'ui/theme'

type PropsWithChildren = {
  title: string
  subtitle?: ReactNode | string
  children: React.ReactNode
}

export const HeaderWithGreyContainer: FunctionComponent<PropsWithChildren> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <React.Fragment>
      <PageHeader title={title} numberOfLines={2} />
      {!!subtitle && (
        <SubtitleContainer>
          {typeof subtitle === 'string' ? <CaptionSubtitle>{subtitle}</CaptionSubtitle> : subtitle}
        </SubtitleContainer>
      )}
      {!!children && <GreyContainer>{children}</GreyContainer>}
    </React.Fragment>
  )
}

const SubtitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(6),
}))

const GreyContainer = styled.View(({ theme }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
  width: theme.isDesktopViewport ? 'fit-content' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))

const CaptionSubtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
