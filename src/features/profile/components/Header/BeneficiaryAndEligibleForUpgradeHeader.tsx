import React, { memo } from 'react'
import { View } from 'react-native'

import { DomainsCredit, EligibilityType } from 'api/gen'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { NonBeneficiaryBanner } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type CreditHeaderProps = {
  featureFlags: { disableActivation: boolean }
  firstName?: string | null
  lastName?: string | null
  age?: number
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
  eligibility?: EligibilityType | null
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function BeneficiaryAndEligibleForUpgradeHeaderComponent({
  featureFlags,
  firstName,
  lastName,
  age,
  domainsCredit,
  depositExpirationDate,
  eligibilityStartDatetime,
  eligibilityEndDatetime,
  eligibility,
}: CreditHeaderProps) {
  return (
    <ViewGap gap={3}>
      <View>
        <CreditHeader
          firstName={firstName}
          lastName={lastName}
          age={age}
          domainsCredit={domainsCredit}
          depositExpirationDate={depositExpirationDate ?? undefined}
          eligibility={eligibility}
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
}

export const BeneficiaryAndEligibleForUpgradeHeader = memo(
  BeneficiaryAndEligibleForUpgradeHeaderComponent
)
