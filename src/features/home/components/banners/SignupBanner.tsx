import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Unlock } from 'ui/svg/icons/Unlock'

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
      leftIcon={StyledUnlock}
      title={title}
      subtitle={subtitle}
      onPress={onSystemBannerPress}
      accessibilityLabel={subtitle}
      analyticsParams={{ type: 'credit', from: 'home' }}
    />
  )
}

const StyledUnlock = styled(Unlock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandSecondary,
}))``
