import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Typo } from 'ui/theme'

type PropsWithChildren = {
  title: string
  subtitle?: ReactNode | string
  withGreyContainer?: boolean
  bannerText?: string
  children: React.ReactNode
} & ProfileFeatureFlagsProps

export const HeaderWithGreyContainer: FunctionComponent<PropsWithChildren> = ({
  title,
  subtitle,
  bannerText,
  children,
  withGreyContainer = true,
  featureFlags,
}) => (
  <React.Fragment>
    <PageHeader title={title} numberOfLines={2} featureFlags={featureFlags} />

    {subtitle ? (
      <SubtitleContainer enableProfileV2={featureFlags.enableProfileV2}>
        {typeof subtitle === 'string' ? <Typo.Body>{subtitle}</Typo.Body> : subtitle}
      </SubtitleContainer>
    ) : (
      <SubtitlePlaceholder />
    )}

    {bannerText ? (
      <BannerContainer withMarginBottom enableProfileV2={featureFlags.enableProfileV2}>
        <Banner label={bannerText} />
      </BannerContainer>
    ) : null}

    {children ? (
      <GreyContainer
        withGreyContainer={withGreyContainer}
        enableProfileV2={featureFlags.enableProfileV2}>
        {children}
      </GreyContainer>
    ) : null}
  </React.Fragment>
)

const SubtitleContainer = styled.View<{ enableProfileV2: boolean }>(
  ({ theme, enableProfileV2 }) => ({
    marginHorizontal: enableProfileV2 ? 0 : theme.contentPage.marginHorizontal,
    marginTop: theme.designSystem.size.spacing.xs,
    marginBottom: theme.designSystem.size.spacing.xl,
  })
)

const SubtitlePlaceholder = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xl,
}))

const GreyContainer = styled.View<{
  withGreyContainer: boolean
  enableProfileV2: boolean
}>(({ theme, withGreyContainer, enableProfileV2 }) => ({
  padding: withGreyContainer ? theme.designSystem.size.spacing.xl : undefined,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: withGreyContainer ? theme.designSystem.color.background.default : undefined,
  borderColor: withGreyContainer ? theme.designSystem.color.border.default : undefined,
  borderWidth: 1,
  marginHorizontal: enableProfileV2 ? 0 : theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.s,
  alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))

const BannerContainer = styled.View<{ withMarginBottom?: boolean; enableProfileV2: boolean }>(
  ({ theme, withMarginBottom = false, enableProfileV2 }) => ({
    marginHorizontal: enableProfileV2 ? 0 : theme.contentPage.marginHorizontal,
    marginBottom: withMarginBottom ? theme.designSystem.size.spacing.xl : undefined,
  })
)
