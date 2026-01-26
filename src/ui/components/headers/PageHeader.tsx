import React from 'react'
import styled from 'styled-components/native'

import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  numberOfLines?: number
  subtitle?: string
  children?: React.ReactNode
  featureFlags?: ProfileFeatureFlagsProps['featureFlags']
}

export const PageHeader = ({
  title,
  numberOfLines = 1,
  subtitle,
  featureFlags,
  children,
}: Props) => {
  return (
    <React.Fragment>
      {featureFlags?.enableProfileV2 ? null : <Spacer.TopScreen />}
      <HeaderContainer enableProfileV2={featureFlags?.enableProfileV2 ?? false}>
        <TitleContainer>
          <TitleText numberOfLines={numberOfLines}>{title}</TitleText>
          {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
        </TitleContainer>
        {children}
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View<{ enableProfileV2: boolean }>(({ theme, enableProfileV2 }) => ({
  flexDirection: 'row',
  marginTop: enableProfileV2 ? 0 : getSpacing(6),
  marginHorizontal: enableProfileV2 ? 0 : theme.contentPage.marginHorizontal,
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
