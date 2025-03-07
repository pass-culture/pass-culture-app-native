import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { env } from 'libs/environment/env'
import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer } from 'ui/theme'
import { CaptionNeutralInfo } from 'ui/theme/typography'

const isWeb = Platform.OS === 'web'

export const AccessibilityFooter = () => {
  if (isWeb) {
    return (
      <AccessibilityFooterContainer>
        <Separator.Horizontal />
        <Container>
          <LogoContainer>
            <ColoredPassCultureLogo />
          </LogoContainer>
          <LinksContainer>
            <InternalTouchableLink navigateTo={getProfileNavConfig('Accessibility')}>
              <CaptionNeutralInfo>Accessibilité&nbsp;: partiellement conforme</CaptionNeutralInfo>
            </InternalTouchableLink>
            <InternalTouchableLink navigateTo={{ screen: 'LegalNotices' }}>
              <CaptionNeutralInfo>Mentions légales</CaptionNeutralInfo>
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
            <LogoMinistere />
          </LogoContainer>
          <Spacer.TabBar />
        </Container>
      </AccessibilityFooterContainer>
    )
  }
  return null
}

const AccessibilityFooterContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Container = styled.View(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  gap: getSpacing(8),
  paddingTop: theme.isDesktopViewport ? getSpacing(8) : getSpacing(6),
  paddingBottom: getSpacing(8),
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const LinksContainer = styled.View(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  gap: theme.isDesktopViewport ? getSpacing(6) : getSpacing(8),
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const ColoredPassCultureLogo = styled(LogoPassCulture).attrs(({ theme }) => ({
  color: theme.uniqueColors.brand,
  width: '100%',
}))``

const LogoContainer = styled.View({
  width: getSpacing(20),
})
