import React from 'react'
import styled from 'styled-components/native'

import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Spacer, Typo } from 'ui/theme'

type ActivationBannerProps = {
  title: string
  subtitle: string
}

export const ActivationBanner = ({ title, subtitle }: ActivationBannerProps) => {
  return (
    <React.Fragment>
      <BannerWithBackground
        leftIcon={StyledBicolorUnlock}
        navigateTo={{ screen: 'IdentityCheckStepper' }}>
        <StyledButtonText>{title}</StyledButtonText>
        <StyledBodyText>{subtitle}</StyledBodyText>
      </BannerWithBackground>
      <Spacer.Column numberOfSpaces={8} />
    </React.Fragment>
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
