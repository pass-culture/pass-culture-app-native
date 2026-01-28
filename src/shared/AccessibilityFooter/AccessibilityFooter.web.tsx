import React from 'react'
import styledWeb from 'styled-components'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { env } from 'libs/environment/env'
import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export type AccessibilityFooterProps = {
  withHorizontalMargin?: boolean
}

export const AccessibilityFooter = ({ withHorizontalMargin = false }: AccessibilityFooterProps) => (
  <AccessibilityFooterContainer withHorizontalMargin={withHorizontalMargin}>
    <Separator.Horizontal />
    <Container gap={5}>
      <LogoContainer>
        <ColoredPassCultureLogo />
      </LogoContainer>
      <LinksContainer gap={4}>
        <InternalTouchableLink navigateTo={getProfilePropConfig('Accessibility')}>
          <StyledBodyAccentXs>Accessibilité&nbsp;: partiellement conforme</StyledBodyAccentXs>
        </InternalTouchableLink>
        <InternalTouchableLink navigateTo={getProfilePropConfig('SiteMapScreen')}>
          <StyledBodyAccentXs>Plan du site</StyledBodyAccentXs>
        </InternalTouchableLink>
        <InternalTouchableLink navigateTo={getProfilePropConfig('LegalNotices')}>
          <StyledBodyAccentXs>Informations légales</StyledBodyAccentXs>
        </InternalTouchableLink>
        <ExternalTouchableLink
          as={ButtonQuaternaryGrey}
          wording="CGU utilisateurs"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          inline
        />
        <ExternalTouchableLink
          as={ButtonQuaternaryGrey}
          wording="Charte des données personnelles"
          externalNav={{ url: env.PRIVACY_POLICY_LINK }}
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          inline
        />
      </LinksContainer>
      <LogoContainer>
        <LogoFrenchRepublic />
      </LogoContainer>
    </Container>
    <Spacer.TabBar />
  </AccessibilityFooterContainer>
)

const AccessibilityFooterContainer = styledWeb.footer<{ withHorizontalMargin?: boolean }>(
  ({ theme, withHorizontalMargin }) => ({
    marginRight: withHorizontalMargin ? theme.contentPage.marginHorizontal : 0,
    marginLeft: withHorizontalMargin ? theme.contentPage.marginHorizontal : 0,
  })
)

const Container = styled(ViewGap)(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  paddingVertical: theme.designSystem.size.spacing.xl,
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const LinksContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
  flexWrap: 'wrap',
  justifyContent: 'center',
  flex: theme.isDesktopViewport ? 1 : undefined,
  marginHorizontal: getSpacing(theme.isDesktopViewport ? 25 : 0),
}))

const ColoredPassCultureLogo = styled(LogoPassCulture).attrs({
  width: getSpacing(20),
})``

const LogoContainer = styled.View({
  width: getSpacing(20),
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
