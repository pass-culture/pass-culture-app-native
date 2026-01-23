import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { shareApp } from 'features/share/helpers/shareApp'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { Section } from 'ui/components/Section'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

export const ShareBanner = () => {
  const shareBannerTitle = 'Partage le pass Culture'
  const shareBannerDescription = 'Recommande le bon plan à tes amis\u00a0!'
  const accessibilityLabel = getComputedAccessibilityLabel(shareBannerTitle, shareBannerDescription)

  const onShareBannerPress = useCallback(() => {
    void analytics.logShareApp({ from: 'profile' })
    void shareApp('profile_banner')
  }, [])

  return (
    <Section title="Partager le pass Culture">
      <BannerWithBackgroundContainer>
        <BannerWithBackground
          backgroundSource={SHARE_APP_BANNER_IMAGE_SOURCE}
          onPress={onShareBannerPress}
          accessibilityRole={AccessibilityRole.BUTTON}
          accessibilityLabel={accessibilityLabel}>
          <ShareAppContainer gap={1}>
            <StyledBodyAccent>{shareBannerTitle}</StyledBodyAccent>
            <StyledBody>{shareBannerDescription}</StyledBody>
          </ShareAppContainer>
        </BannerWithBackground>
      </BannerWithBackgroundContainer>
    </Section>
  )
}

const BannerWithBackgroundContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))

const ShareAppContainer = styled(ViewGap)(({ theme }) => ({
  paddingRight: theme.isSmallScreen ? 0 : theme.designSystem.size.spacing.l,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
