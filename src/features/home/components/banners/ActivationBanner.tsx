import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { TypoDS } from 'ui/theme'

type ActivationBannerProps = {
  title: string
  subtitle: string
  icon: FunctionComponent<AccessibleIcon>
  from: StepperOrigin
}

export const ActivationBanner = ({ title, subtitle, icon, from }: ActivationBannerProps) => {
  const StyledIcon = styled(icon).attrs(({ theme }) => ({
    color: theme.colors.white,
    color2: theme.colors.white,
  }))``

  return (
    <BannerWithBackground
      leftIcon={StyledIcon}
      navigateTo={{ screen: 'Stepper', params: { from } }}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{subtitle}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledButtonText = styled(TypoDS.BodyAccent)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
