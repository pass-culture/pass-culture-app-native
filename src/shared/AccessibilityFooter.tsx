import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer } from 'ui/theme'
import { CaptionNeutralInfo } from 'ui/theme/typography'

const isWeb = Platform.OS === 'web'

const AccessibilityFooter = () => {
  return (
    <React.Fragment>
      <Separator.Horizontal />
      <Container>
        <LogoPassCultureContainer>
          <ColoredPassCultureLogo />
        </LogoPassCultureContainer>
        <LinksContainer>
          {isWeb ? null : (
            <ExternalTouchableLink externalNav={{ url: 'https://passculture.app/accueil' }}>
              <CaptionNeutralInfo>pass Culture</CaptionNeutralInfo>
            </ExternalTouchableLink>
          )}
          <InternalTouchableLink navigateTo={{ screen: 'Accessibility' }}>
            <CaptionNeutralInfo>Accessibilité&nbsp;: partiellement conforme</CaptionNeutralInfo>
          </InternalTouchableLink>
          <InternalTouchableLink navigateTo={{ screen: 'LegalNotices' }}>
            <CaptionNeutralInfo>Mentions légales</CaptionNeutralInfo>
          </InternalTouchableLink>
          <ExternalTouchableLink externalNav={{ url: env.CGU_LINK }}>
            <CaptionNeutralInfo>CGU utilisateurs</CaptionNeutralInfo>
          </ExternalTouchableLink>
          <ExternalTouchableLink externalNav={{ url: env.DATA_PRIVACY_CHART_LINK }}>
            <CaptionNeutralInfo>Charte des données personnelles</CaptionNeutralInfo>
          </ExternalTouchableLink>
        </LinksContainer>
        <LogoMinistereContainer>
          <LogoMinistere />
        </LogoMinistereContainer>
        <Spacer.TabBar />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  gap: getSpacing(8),
  paddingHorizontal: getSpacing(8),
  paddingTop: theme.isDesktopViewport ? getSpacing(8) : getSpacing(6),
  paddingBottom: getSpacing(8),
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const LinksContainer = styled.View(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'center' : undefined,
  gap: theme.isDesktopViewport ? getSpacing(6) : getSpacing(8),
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const LogoPassCultureContainer = styled.View({
  alignItems: 'flex-start', // doesn't changed anything, should I keep?
})

const ColoredPassCultureLogo = styled(LogoPassCulture).attrs(({ theme }) => ({
  color: theme.uniqueColors.brand,
  // width: getSpacing(40),
  height: getSpacing(10),
}))``

const LogoMinistereContainer = styled.View({
  width: getSpacing(13.5),
  height: getSpacing(12),
})

export default AccessibilityFooter
