import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'

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
    const depositExpirationDate = user.depositExpirationDate
      ? formatToSlashedFrenchDate(user.depositExpirationDate.toString())
      : undefined

    const isExpired = user.depositExpirationDate
      ? new Date(user.depositExpirationDate) < new Date()
      : false

    if (isExpired) {
      return <ExBeneficiaryHeader depositExpirationDate={depositExpirationDate} />
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

  if (user.eligibilityStartDatetime === undefined || user.eligibilityEndDatetime === undefined) {
    return null
  }

  return (
    <NonBeneficiaryHeader
      email={user.email}
      eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
      eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
    />
  )
}
