import React from 'react'

import { Expense, UserProfileResponse } from 'api/gen'
import { ExpensesAndDepositVersion, ExpenseV2 } from 'features/profile/components/types'
import { computeRemainingCredit } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'

import { BeneficiaryHeader } from './BeneficiaryHeader'
import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props

  if (!user) {
    // TODO(PC-6372) afficher le header non connecté
    return null
  }

  if (user.isBeneficiary) {
    const depositVersion = user.depositVersion && user.depositVersion === 1 ? 1 : 2
    const depositExpirationDate = user.depositExpirationDate
      ? formatToSlashedFrenchDate(user.depositExpirationDate.toString())
      : undefined

    return (
      <BeneficiaryHeader
        firstName={user.firstName}
        lastName={user.lastName}
        remainingCredit={computeRemainingCredit(user.expenses)}
        depositExpirationDate={depositExpirationDate}
        {...getBeneficiaryHeaderProps(depositVersion, user.expenses)}
      />
    )
  }

  if (!user.dateOfBirth) {
    return null
  }

  return <NonBeneficiaryHeader email={user.email} dateOfBirth={user.dateOfBirth.toString()} />
}

export function getBeneficiaryHeaderProps(
  depositVersion: 1 | 2,
  expenses: Expense[] | ExpenseV2[]
) {
  let localProps: ExpensesAndDepositVersion
  if (depositVersion === 1) {
    localProps = {
      expenses: expenses as Expense[],
      depositVersion: depositVersion,
    }
  } else {
    localProps = {
      expenses: expenses as ExpenseV2[],
      depositVersion: depositVersion,
    }
  }
  return localProps
}
