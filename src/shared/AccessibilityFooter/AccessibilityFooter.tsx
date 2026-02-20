import React from 'react'
import { View } from 'react-native'
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

type AccessibilityFooterProps = { withHorizontalMargin?: boolean }

export const AccessibilityFooter = ({ withHorizontalMargin = false }: AccessibilityFooterProps) => {
  return (
    <AccessibilityFooterContainer
      testID="accessibility-footer-container"
      withHorizontalMargin={withHorizontalMargin}
      accessibilityRole={AccessibilityRole.FOOTER}>
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
            numberOfLines={2}
          />
          <InternalTouchableLink
            navigateTo={getProfilePropConfig('SiteMapScreen')}
            as={Button}
            variant="tertiary"
            color="neutral"
            size="small"
            wording="Plan du site"
            numberOfLines={2}
          />
          <InternalTouchableLink
            navigateTo={getProfilePropConfig('LegalNotices')}
            as={Button}
            variant="tertiary"
            color="neutral"
            size="small"
            wording="Informations légales"
            numberOfLines={2}
          />
          <ExternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            size="small"
            wording="Conditions Générales d’Utilisation"
            externalNav={{ url: env.CGU_LINK }}
            icon={ExternalSiteFilled}
            numberOfLines={2}
          />
          <ExternalTouchableLink
            as={Button}
            size="small"
            variant="tertiary"
            color="neutral"
            wording="Charte des données personnelles"
            externalNav={{ url: env.PRIVACY_POLICY_LINK }}
            icon={ExternalSiteFilled}
            numberOfLines={2}
          />
          <ExternalTouchableLink
            as={Button}
            size="small"
            variant="tertiary"
            color="neutral"
            wording="Charte d’utilisation et de bonne conduite"
            externalNav={{ url: env.CODE_OF_CONDUCT_LINK }}
            icon={ExternalSiteFilled}
            numberOfLines={2}
          />
        </LinksContainer>
        <LogoContainer>
          <LogoFrenchRepublic />
        </LogoContainer>
      </Container>
      <Spacer.TabBar />
    </AccessibilityFooterContainer>
  )
}

const AccessibilityFooterContainer = styled(View)<{
  withHorizontalMargin?: boolean
}>(({ theme, withHorizontalMargin }) => ({
  marginRight: withHorizontalMargin ? theme.contentPage.marginHorizontal : 0,
  marginLeft: withHorizontalMargin ? theme.contentPage.marginHorizontal : 0,
}))

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

const LogoContainer = styled(View)({
  width: getSpacing(20),
})
