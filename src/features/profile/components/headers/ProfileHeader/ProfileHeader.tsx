import { t } from '@lingui/macro'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { BeneficiaryHeader } from 'features/profile/components/BeneficiaryHeader'
import { ExBeneficiaryHeader } from 'features/profile/components/ExBeneficiaryHeader'
import { LoggedOutHeader } from 'features/profile/components/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/NonBeneficiaryHeader'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

const getDisplayedExpirationDate = (expirationDate: Date, isUnderageBeneficiary: boolean) =>
  isUnderageBeneficiary
    ? t({
        id: 'profile expiration date for underage',
        values: {
          day: formatToSlashedFrenchDate(expirationDate.toISOString()),
        },
        message: '{day}',
      })
    : t({
        id: 'profile expiration date',
        values: {
          day: formatToSlashedFrenchDate(expirationDate.toISOString()),
          hour: formatToHour(expirationDate),
        },
        message: '{day} à {hour}',
      })

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const { isLoggedIn } = useAuthContext()

  // Not use user? because it's already tested here
  if (!isLoggedIn || !user) {
    return <LoggedOutHeader />
  }
  const depositExpirationDate = user.depositExpirationDate
    ? new Date(user.depositExpirationDate)
    : undefined

  const displayedDepositExpirationDate = depositExpirationDate
    ? getDisplayedExpirationDate(depositExpirationDate, isUnderageBeneficiary)
    : undefined

  const isDepositExpired = depositExpirationDate ? depositExpirationDate < new Date() : false

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

  if (isDepositExpired) {
    return (
      <ExBeneficiaryHeader
        firstName={user.firstName}
        lastName={user.lastName}
        depositExpirationDate={displayedDepositExpirationDate}
      />
    )
  }

  return (
    <BeneficiaryHeader
      firstName={user.firstName}
      lastName={user.lastName}
      domainsCredit={user.domainsCredit}
      depositExpirationDate={displayedDepositExpirationDate}
    />
  )
}
