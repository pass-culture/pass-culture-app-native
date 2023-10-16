import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
      {!!subtitle && (
        <SubtitleContainer>
          <Spacer.Column numberOfSpaces={1} />
          {typeof subtitle === 'string' ? <Typo.Body>{subtitle}</Typo.Body> : subtitle}
        </SubtitleContainer>
      )}
      {!!bannerText && (
        <BannerContainer>
          <InfoBanner message={bannerText} icon={Info} />
          <Spacer.Column numberOfSpaces={6} />
        </BannerContainer>
      )}
      {!!children && (
        <GreyContainer withGreyContainer={withGreyContainer}>{children}</GreyContainer>
      )}
    </React.Fragment>
  )
}

const SubtitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(6),
}))

const GreyContainer = styled.View<{ withGreyContainer: boolean }>(
  ({ theme, withGreyContainer }) => ({
    padding: withGreyContainer ? getSpacing(6) : undefined,
    borderRadius: getSpacing(2),
    backgroundColor: withGreyContainer ? theme.colors.greyLight : undefined,
    marginHorizontal: theme.contentPage.marginHorizontal,
    marginBottom: getSpacing(2),
    width: theme.isDesktopViewport ? 'fit-content' : undefined,
    minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
  })
)
const BannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
