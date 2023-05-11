import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Typo } from 'ui/theme'

const onBeforeNavigate = () => analytics.logSignUpClicked({ from: 'home' })

export const SignupBanner = () => {
  return (
    <BannerWithBackground
      leftIcon={StyledBicolorUnlock}
      navigateTo={{ screen: 'SignupForm' }}
      onBeforeNavigate={onBeforeNavigate}>
      <StyledButtonText>Débloque ton crédit</StyledButtonText>
      <StyledBodyText>Crée ton compte si tu as entre 15 et 18 ans&nbsp;!</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
