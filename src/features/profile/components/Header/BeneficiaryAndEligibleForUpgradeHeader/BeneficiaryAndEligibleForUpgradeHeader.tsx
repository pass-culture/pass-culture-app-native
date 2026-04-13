import React, { memo } from 'react'
import { View } from 'react-native'

import { DomainsCredit } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { NonBeneficiaryBanner } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type CreditHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  age?: number
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
  eligibilityType?: UserEligibilityType | null
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  statusType: UserStatusType | null
} & ProfileFeatureFlagsProps

const BeneficiaryAndEligibleForUpgradeHeaderComponent = ({
  featureFlags,
  firstName,
  lastName,
  age,
  domainsCredit,
  depositExpirationDate,
  eligibilityStartDatetime,
  eligibilityEndDatetime,
  statusType,
  eligibilityType,
}: CreditHeaderProps) => (
  <ViewGap gap={3}>
    <View>
      <CreditHeader
        firstName={firstName}
        lastName={lastName}
        age={age}
        domainsCredit={domainsCredit}
        depositExpirationDate={depositExpirationDate ?? undefined}
        eligibilityType={eligibilityType}
        featureFlags={featureFlags}
        statusType={statusType}
      />
    </View>
    <NonBeneficiaryBanner
      featureFlags={featureFlags}
      eligibilityStartDatetime={eligibilityStartDatetime?.toString()}
      eligibilityEndDatetime={eligibilityEndDatetime?.toString()}
      eligibilityEndDateInSystemBanner
    />
  </ViewGap>
)

export const BeneficiaryAndEligibleForUpgradeHeader = memo(
  BeneficiaryAndEligibleForUpgradeHeaderComponent
)
