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

const displayedExpirationDate = (expirationDate: Date, isUnderageBeneficiary: boolean) =>
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
  const expirationDate = user.depositExpirationDate
    ? new Date(user.depositExpirationDate)
    : undefined

  const depositExpirationDate = expirationDate
    ? displayedExpirationDate(expirationDate, isUnderageBeneficiary)
    : undefined

  const isExpired = expirationDate ? expirationDate < new Date() : false

  if (user.isBeneficiary) {
    if (isExpired) {
      return (
        <ExBeneficiaryHeader
          firstName={user.firstName}
          lastName={user.lastName}
          depositExpirationDate={depositExpirationDate}
        />
      )
    }

    return (
      <BeneficiaryHeader
        firstName={user.firstName}
        lastName={user.lastName}
        domainsCredit={user.domainsCredit}
        depositExpirationDate={depositExpirationDate}
      />
    )
  }

  return (
    <NonBeneficiaryHeader
      eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
      eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
      nextBeneficiaryValidationStep={user.nextBeneficiaryValidationStep}
      subscriptionMessage={user.subscriptionMessage}
    />
  )
}
