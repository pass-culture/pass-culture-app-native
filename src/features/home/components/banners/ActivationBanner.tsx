import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Spacer, Typo } from 'ui/theme'

export const ActivationBanner = () => {
  const { user } = useAuthContext()
  const credit = useGetDepositAmountsByAge(user?.birthDate)

  return (
    <React.Fragment>
      <BannerWithBackground
        leftIcon={StyledBicolorUnlock}
        navigateTo={{ screen: 'IdentityCheckStepper' }}>
        <StyledButtonText>Débloque tes {credit}</StyledButtonText>
        <StyledBodyText>à dépenser sur l’application</StyledBodyText>
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
