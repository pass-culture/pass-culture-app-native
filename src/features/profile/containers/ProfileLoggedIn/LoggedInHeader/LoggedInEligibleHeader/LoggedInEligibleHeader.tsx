import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { EligibleFreeHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/EligibleFreeHeader'
import { EligibleHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/EligibleHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInEligibleHeader = ({ user, featureFlags }: Props) => {
  const { banner } = useActivationBanner()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToStepper = () => {
    navigate(...getSubscriptionHookConfig('Stepper', { from: StepperOrigin.PROFILE }))
  }

  const commonProps = { user, featureFlags }
  const beneficiaryProps = { banner, onPress: navigateToStepper }

  let header: React.ReactNode

  switch (user.eligibilityType) {
    case UserEligibilityType.ELIGIBLE_CREDIT_V1_18:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_15:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_16:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_17:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_18:
    case UserEligibilityType.ELIGIBLE_CREDIT_V3_17:
    case UserEligibilityType.ELIGIBLE_CREDIT_V3_18:
      header = <EligibleHeader {...commonProps} {...beneficiaryProps} />
      break

    case UserEligibilityType.ELIGIBLE_CREDIT_V3_15:
      header = <EligibleFreeHeader {...commonProps} defaultAge={15} />
      break

    case UserEligibilityType.ELIGIBLE_CREDIT_V3_16:
      header = <EligibleFreeHeader {...commonProps} defaultAge={16} />
      break

    default:
      header = <PageHeader title="Mon profil" featureFlags={featureFlags} numberOfLines={3} />
  }

  return <View testID="logged-in-eligible-header">{header}</View>
}
