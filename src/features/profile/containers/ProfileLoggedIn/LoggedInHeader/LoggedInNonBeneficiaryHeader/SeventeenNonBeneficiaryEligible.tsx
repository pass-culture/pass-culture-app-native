import React from 'react'
import { View } from 'react-native'

import { ActivationBanner } from 'features/home/api/useActivationBanner'
import { EligibilityMessage } from 'features/profile/components/Header/NonBeneficiaryHeader/EligibilityMessage'
import { getEligibilityEndDatetime } from 'features/profile/helpers/getEligibilityEndDatetime'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Unlock } from 'ui/svg/icons/Unlock'

type Props = {
  user: UserProfileResponseWithoutSurvey
  banner: ActivationBanner
  onPress: () => void
} & ProfileFeatureFlagsProps

export const SeventeenNonBeneficiaryEligible = ({ user, featureFlags, banner, onPress }: Props) => {
  const { firstName, lastName, eligibilityEndDatetime } = user
  const formattedEligibilityEndDatetime = getEligibilityEndDatetime({ eligibilityEndDatetime })
  const headerTitle = getProfileHeaderTitle({ firstName, lastName })

  const bannerTitle = banner.title ?? 'TODO'
  const bannerSubtitle = banner.text ?? 'TODO'
  const bannerAccessibilityLabel = `${bannerTitle} ${bannerSubtitle}`

  return (
    <View testID="seventeen-non-beneficiary-eligible-header">
      <PageHeader title={headerTitle} featureFlags={featureFlags} />
      <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
      <SystemBanner
        leftIcon={Unlock}
        title={bannerTitle}
        subtitle={bannerSubtitle}
        onPress={onPress}
        accessibilityLabel={bannerAccessibilityLabel}
        analyticsParams={{ type: 'credit', from: 'profile' }}
      />
    </View>
  )
}
