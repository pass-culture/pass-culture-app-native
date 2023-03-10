import React from 'react'
import styled from 'styled-components/native'

import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Typo } from 'ui/theme'

type ActivationBannerProps = {
  title: string
  subtitle: string
}

export const ActivationBanner = ({ title, subtitle }: ActivationBannerProps) => {
  return (
    <BannerWithBackground
      leftIcon={StyledBicolorUnlock}
      navigateTo={{ screen: 'IdentityCheckStepper' }}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{subtitle}</StyledBodyText>
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
