import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type ActivationBannerProps = {
  title: string
  subtitle: string
  icon: FunctionComponent<IconInterface>
}

export const ActivationBanner = ({ title, subtitle, icon }: ActivationBannerProps) => {
  const StyledIcon = styled(icon).attrs(({ theme }) => ({
    color: theme.colors.white,
    color2: theme.colors.white,
  }))``

  return (
    <BannerWithBackground leftIcon={StyledIcon} navigateTo={{ screen: 'IdentityCheckStepper' }}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{subtitle}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
