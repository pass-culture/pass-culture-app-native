import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { PageHeader } from 'ui/components/headers/PageHeader'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { getSpacing, Typo } from 'ui/theme'

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
}) => {
  return (
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
}

const SubtitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginTop: getSpacing(1),
  marginBottom: getSpacing(6),
}))

const SubtitlePlaceholder = styled.View({
  height: getSpacing(6),
})

const GreyContainer = styled.View<{ withGreyContainer: boolean }>(
  ({ theme, withGreyContainer }) => ({
    padding: withGreyContainer ? getSpacing(6) : undefined,
    borderRadius: theme.designSystem.size.borderRadius.m,
    backgroundColor: withGreyContainer ? theme.designSystem.color.background.default : undefined,
    borderColor: withGreyContainer ? theme.designSystem.color.border.default : undefined,
    borderWidth: 1,
    marginHorizontal: theme.contentPage.marginHorizontal,
    marginBottom: getSpacing(2),
    alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
    minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
  })
)

const BannerContainer = styled.View<{ withMarginBottom?: boolean }>(
  ({ theme, withMarginBottom = false }) => ({
    marginHorizontal: theme.contentPage.marginHorizontal,
    marginBottom: withMarginBottom ? getSpacing(6) : undefined,
  })
)
