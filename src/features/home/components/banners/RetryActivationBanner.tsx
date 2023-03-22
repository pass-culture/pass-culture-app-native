import React from 'react'
import styled from 'styled-components/native'

import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { Typo } from 'ui/theme'

type RetryActivationBannerProps = {
  title: string
  subtitle: string
}

export const RetryActivationBanner = ({ title, subtitle }: RetryActivationBannerProps) => {
  return (
    <BannerWithBackground
      leftIcon={StyledArrowAgain}
      navigateTo={{ screen: 'IdentityCheckStepper' }}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{subtitle}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
