import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'

const onBeforeNavigate = () => analytics.logSignUpClicked({ from: 'home' })

export const SignupBanner: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const title = 'Débloque ton crédit'
  const subtitle = 'Crée ton compte si tu as 17 ou 18 ans\u00a0!'

  const onSystemBannerPress = () => {
    onBeforeNavigate()
    navigate('SignupForm', { from: StepperOrigin.HOME })
  }

  return (
    <SystemBanner
      leftIcon={StyledSystemBannerBicolorUnlock}
      title={title}
      subtitle={subtitle}
      onPress={onSystemBannerPress}
      accessibilityLabel={subtitle}
      analyticsParams={{ type: 'credit', from: 'home' }}
    />
  )
}

const StyledSystemBannerBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``
