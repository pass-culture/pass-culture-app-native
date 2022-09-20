import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'

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
