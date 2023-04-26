import React from 'react'
import styled from 'styled-components/native'

import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Typo } from 'ui/theme'

type ActivationBannerProps = {
  title: string
  subtitle: string
  icon: string
}

export const ActivationBanner = ({ title, subtitle, icon }: ActivationBannerProps) => {
  return (
    <BannerWithBackground
      leftIcon={icon === "BicolorUnlock" ? StyledBicolorUnlock : icon === "ArrowAgain" ? StyledArrowAgain : StyledBirthdayCake}
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

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
    color: theme.colors.white,
}))``

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
