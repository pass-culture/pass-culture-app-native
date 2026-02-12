import React from 'react'
import styledWeb from 'styled-components'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing, Spacer } from 'ui/theme'

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
        <InternalTouchableLink
          navigateTo={getProfilePropConfig('Accessibility')}
          as={Button}
          variant="tertiary"
          color="neutral"
          size="small"
          wording="Accessibilité&nbsp;: partiellement conforme"
          accessibilityRole={AccessibilityRole.BUTTON}
        />
        <InternalTouchableLink
          navigateTo={getProfilePropConfig('SiteMapScreen')}
          as={Button}
          variant="tertiary"
          color="neutral"
          size="small"
          wording="Plan du site"
          accessibilityRole={AccessibilityRole.BUTTON}
        />
        <InternalTouchableLink
          navigateTo={getProfilePropConfig('LegalNotices')}
          as={Button}
          variant="tertiary"
          color="neutral"
          size="small"
          wording="Informations légales"
          accessibilityRole={AccessibilityRole.BUTTON}
        />
        <ExternalTouchableLink
          as={Button}
          variant="tertiary"
          color="neutral"
          size="small"
          wording="CGU utilisateurs"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSiteFilled}
          accessibilityRole={AccessibilityRole.LINK}
        />
        <ExternalTouchableLink
          as={Button}
          size="small"
          variant="tertiary"
          color="neutral"
          wording="Charte des données personnelles"
          externalNav={{ url: env.PRIVACY_POLICY_LINK }}
          icon={ExternalSiteFilled}
          accessibilityRole={AccessibilityRole.LINK}
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
  alignItems: theme.isDesktopViewport ? 'center' : 'flex-start',
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
