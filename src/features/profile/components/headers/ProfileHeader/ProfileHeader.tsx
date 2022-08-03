import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { CreditHeader } from 'features/profile/components/headers/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/NonBeneficiaryHeader'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props
  const { isLoggedIn } = useAuthContext()

  // Not use user? because it's already tested here
  if (!isLoggedIn || !user) {
    return <LoggedOutHeader />
  }

  if (!user.isBeneficiary || user.isEligibleForBeneficiaryUpgrade) {
    return (
      <NonBeneficiaryHeader
        eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
        eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
        isEligibleForBeneficiaryUpgrade={user.isEligibleForBeneficiaryUpgrade}
        subscriptionMessage={user.subscriptionMessage}
      />
    )
  }

  return (
    <CreditHeader
      firstName={user.firstName}
      lastName={user.lastName}
      domainsCredit={user.domainsCredit}
      depositExpirationDate={user.depositExpirationDate || undefined}
    />
  )
}
