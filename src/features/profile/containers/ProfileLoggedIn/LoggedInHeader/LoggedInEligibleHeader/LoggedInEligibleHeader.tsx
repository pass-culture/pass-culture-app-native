import React from 'react'
import { View } from 'react-native'

import { SubscriptionStepperResponseV2 } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { EligibleFreeHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/EligibleFreeHeader'
import { EligibleHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/EligibleHeader'
import { logHeaderFallback } from 'features/profile/helpers/logHeaderFallback'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = {
  user: UserProfileResponseWithoutSurvey
  subscriptionInfos?: SubscriptionStepperResponseV2
} & ProfileFeatureFlagsProps

export const LoggedInEligibleHeader = ({ user, featureFlags, subscriptionInfos }: Props) => {
  const commonProps = { user, featureFlags }

  let header: React.ReactNode

  switch (user.eligibilityType) {
    case UserEligibilityType.ELIGIBLE_CREDIT_V1_18:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_15:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_16:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_17:
    case UserEligibilityType.ELIGIBLE_CREDIT_V2_18:
    case UserEligibilityType.ELIGIBLE_CREDIT_V3_17:
    case UserEligibilityType.ELIGIBLE_CREDIT_V3_18:
      header = <EligibleHeader {...commonProps} subscriptionInfos={subscriptionInfos} />
      break

    case UserEligibilityType.ELIGIBLE_CREDIT_V3_15:
      header = <EligibleFreeHeader {...commonProps} defaultAge={15} />
      break

    case UserEligibilityType.ELIGIBLE_CREDIT_V3_16:
      header = <EligibleFreeHeader {...commonProps} defaultAge={16} />
      break

    default:
      logHeaderFallback({ user, headerType: UserStatusType.ELIGIBLE })
      header = <PageHeader title="Mon profil" featureFlags={featureFlags} numberOfLines={3} />
  }

  return <View testID="logged-in-eligible-header">{header}</View>
}
