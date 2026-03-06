import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { ActivationBanner as ActivationBannerProps } from 'features/home/api/useActivationBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Unlock } from 'ui/svg/icons/Unlock'

type Props = { banner: ActivationBannerProps }

export const ActivationBannerDefault = ({ banner }: Props) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToStepper = () => {
    navigate(...getSubscriptionHookConfig('Stepper', { from: StepperOrigin.PROFILE }))
  }

  const bannerTitle = banner.title
  const bannerSubtitle = banner.text
  const bannerAccessibilityLabel = getComputedAccessibilityLabel(bannerTitle, bannerSubtitle)

  return (
    <View testID="activation-banner-default">
      <SystemBanner
        leftIcon={Unlock}
        title={bannerTitle}
        subtitle={bannerSubtitle}
        onPress={navigateToStepper}
        accessibilityLabel={bannerAccessibilityLabel}
        analyticsParams={{ type: 'credit', from: 'profile' }}
      />
    </View>
  )
}
