import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment'
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

export const FOOTER_ID = 'footer_id_for_quick_access'

export const AccessibilityFooter = () => {
  if (isWeb) {
    return (
      <AccessibilityFooterContainer>
        <View accessibilityRole={AccessibilityRole.FOOTER} nativeID={FOOTER_ID}>
          <Separator.Horizontal />
          <Container>
            <LogoContainer>
              <ColoredPassCultureLogo />
            </LogoContainer>
            <LinksContainer>
              <InternalTouchableLink navigateTo={{ screen: 'Accessibility' }}>
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
                externalNav={{ url: env.DATA_PRIVACY_CHART_LINK }}
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
        </View>
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
