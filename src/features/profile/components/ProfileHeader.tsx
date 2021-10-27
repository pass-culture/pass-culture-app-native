import { t } from '@lingui/macro'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers'

import { BeneficiaryHeader } from './BeneficiaryHeader'
import { ExBeneficiaryHeader } from './ExBeneficiaryHeader'
import { LoggedOutHeader } from './LoggedOutHeader'
import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props

  if (!user) {
    return <LoggedOutHeader />
  }

  if (user.isBeneficiary) {
    const expirationDate = user.depositExpirationDate
      ? new Date(user.depositExpirationDate)
      : undefined

    const depositExpirationDate = expirationDate
      ? t({
          id: 'profile expiration date',
          values: {
            day: formatToSlashedFrenchDate(expirationDate.toISOString()),
            hour: formatToHour(expirationDate),
          },
          message: '{day} à {hour}',
        })
      : undefined

    const isExpired = expirationDate ? expirationDate < new Date() : false

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
      email={user.email}
      eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
      eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
      nextBeneficiaryValidationStep={user.nextBeneficiaryValidationStep}
      subscriptionMessage={user.subscriptionMessage}
    />
  )
}
