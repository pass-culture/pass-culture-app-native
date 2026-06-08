import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { PageHeader } from 'ui/components/headers/PageHeader'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Typo } from 'ui/theme'

type PropsWithChildren = {
  title: string
  subtitle?: ReactNode | string
  withGreyContainer?: boolean
  bannerText?: string
  children: React.ReactNode
}

export const HeaderWithGreyContainer: FunctionComponent<PropsWithChildren> = ({
  title,
  subtitle,
  bannerText,
  children,
  withGreyContainer = true,
}) => (
  <React.Fragment>
    <PageHeader title={title} numberOfLines={2} />

    {subtitle ? (
      <SubtitleContainer>
        {typeof subtitle === 'string' ? <Typo.Body>{subtitle}</Typo.Body> : subtitle}
      </SubtitleContainer>
    ) : (
      <SubtitlePlaceholder />
    )}

    {bannerText ? (
      <BannerContainer withMarginBottom>
        <Banner label={bannerText} />
      </BannerContainer>
    ) : null}

    {children ? (
      <GreyContainer withGreyContainer={withGreyContainer}>{children}</GreyContainer>
    ) : null}
  </React.Fragment>
)

const SubtitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const SubtitlePlaceholder = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xl,
}))

const GreyContainer = styled.View<{
  withGreyContainer: boolean
}>(({ theme, withGreyContainer }) => ({
  padding: withGreyContainer ? theme.designSystem.size.spacing.xl : undefined,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: withGreyContainer ? theme.designSystem.color.background.default : undefined,
  borderColor: withGreyContainer ? theme.designSystem.color.border.default : undefined,
  borderWidth: 1,
  marginBottom: theme.designSystem.size.spacing.s,
  alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))

const BannerContainer = styled.View<{ withMarginBottom?: boolean }>(
  ({ theme, withMarginBottom = false }) => ({
    marginBottom: withMarginBottom ? theme.designSystem.size.spacing.xl : undefined,
  })
)
