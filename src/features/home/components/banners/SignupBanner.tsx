import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Typo, TypoDS } from 'ui/theme'

const onBeforeNavigate = () => analytics.logSignUpClicked({ from: 'home' })

type Props = {
  hasGraphicRedesign: boolean
}

export const SignupBanner: FunctionComponent<Props> = ({ hasGraphicRedesign }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const enableCreditV3 = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CREDIT_V3)

  const title = 'Débloque ton crédit'
  const subtitle = `Crée ton compte si tu as entre ${enableCreditV3 ? '17 et 18' : '15 et 18'} ans\u00a0!`

  const onSystemBannerPress = () => {
    onBeforeNavigate()
    navigate('SignupForm', { from: StepperOrigin.HOME })
  }

  return hasGraphicRedesign ? (
    <SystemBanner
      LeftIcon={<StyledSystemBannerBicolorUnlock />}
      title={title}
      subtitle={subtitle}
      onPress={onSystemBannerPress}
      accessibilityLabel={subtitle}
      analyticsParams={{ type: 'credit', from: 'home' }}
    />
  ) : (
    <BannerWithBackground
      leftIcon={StyledBicolorUnlock}
      navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.HOME } }}
      onBeforeNavigate={onBeforeNavigate}
      testID="bannerWithBackground">
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{subtitle}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``

const StyledSystemBannerBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
