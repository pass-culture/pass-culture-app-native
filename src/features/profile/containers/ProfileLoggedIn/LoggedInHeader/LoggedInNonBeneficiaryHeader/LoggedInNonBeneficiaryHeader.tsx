import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { EighteenNonBeneficiaryEligible } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/EighteenNonBeneficiaryEligible'
import { FifteenNonBeneficiaryEligible } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/FifteenNonBeneficiaryEligible'
import { GeneralPublic } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/GeneralPublic'
import { SeventeenNonBeneficiaryEligible } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/SeventeenNonBeneficiaryEligible'
import { SixteenNonBeneficiaryEligible } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/SixteenNonBeneficiaryEligible'
import { getUserStatus } from 'features/profile/helpers/getUserStatus'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInNonBeneficiaryHeader = ({ user, featureFlags }: Props) => {
  const { banner } = useActivationBanner()
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToStepper = () => {
    navigate(...getSubscriptionHookConfig('Stepper', { from: StepperOrigin.PROFILE }))
  }

  const { FIFTEEN, SIXTEEN, SEVENTEEN, EIGHTEEN, GENERAL_PUBLIC } = getUserStatus({ user })
  const commonProps = { user, featureFlags }
  const commonPropsBeneficiary = { banner, onPress: navigateToStepper }

  let header = <PageHeader title="Mon profil" featureFlags={featureFlags} />

  if (FIFTEEN.NON_BENEFICIARY_ELIGIBLE) {
    header = <FifteenNonBeneficiaryEligible {...commonProps} />
  }

  if (SIXTEEN.NON_BENEFICIARY_ELIGIBLE) {
    header = <SixteenNonBeneficiaryEligible {...commonProps} />
  }

  if (SEVENTEEN.NON_BENEFICIARY_ELIGIBLE) {
    header = <SeventeenNonBeneficiaryEligible {...commonProps} {...commonPropsBeneficiary} />
  }

  if (EIGHTEEN.NON_BENEFICIARY_ELIGIBLE) {
    header = <EighteenNonBeneficiaryEligible {...commonProps} {...commonPropsBeneficiary} />
  }

  if (GENERAL_PUBLIC) {
    header = <GeneralPublic {...commonProps} />
  }

  return <View testID="logged-in-non-beneficiary-header">{header}</View>
}
