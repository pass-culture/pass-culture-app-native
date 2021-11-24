import { t } from '@lingui/macro'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers'

import { BeneficiaryHeader } from './BeneficiaryHeader'
import { ExBeneficiaryHeader } from './ExBeneficiaryHeader'
import { LoggedOutHeader } from './LoggedOutHeader'
import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

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

  if (!user) {
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
