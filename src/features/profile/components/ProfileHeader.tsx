import React from 'react'

import { Expense, ExpenseDomain, UserProfileResponse } from 'api/gen'

import { BeneficiaryHeader } from './BeneficiaryHeader'
import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

// TODO(PC-6169) remove this when UserProfileResponse is handled on this page
const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 200 },
  { current: 70, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 70, domain: ExpenseDomain.Physical, limit: 200 },
]

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props

  if (!user) {
    // afficher le header non connecté
    return null
  }

  if (props.user?.isBeneficiary) {
    return (
      <BeneficiaryHeader
        depositVersion={1}
        expenses={expenses_v1}
        firstName={'Rosa'}
        lastName={'Bonheur'}
        remainingCredit={150}
      />
    )
  }

  if (!user.dateOfBirth) {
    return null
  }

  return <NonBeneficiaryHeader email={user.email} dateOfBirth={user.dateOfBirth.toString()} />
}
