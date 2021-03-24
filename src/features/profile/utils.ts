import _ from 'lodash'

import { Expense, ExpenseDomain, UserProfileResponse } from 'api/gen/api'
import { Credit } from 'features/home/services/useAvailableCredit'
import { ExpenseDomainOrderV1, ExpenseDomainOrderV2 } from 'features/profile/components/types'
import { ExpenseV2 } from 'features/profile/components/types'

export function sortExpenses(depositVersion: 1 | 2, expenses: Expense[] | ExpenseV2[]) {
  if (depositVersion === 1) {
    return _.sortBy(expenses, function (expense: Expense) {
      return ExpenseDomainOrderV1[expense.domain]
    }) as Expense[]
  }
  return _.sortBy(expenses, function (expense: ExpenseV2) {
    return ExpenseDomainOrderV2[expense.domain]
  }) as ExpenseV2[]
}

export function computeWalletBalance(expenses: Expense[] | ExpenseV2[]): number {
  const allExpense = expenses.find((expense) => expense.domain === ExpenseDomain.All)
  return allExpense ? allExpense.limit - allExpense.current : 0
}

export function computeRemainingCredit(
  walletBalance: number,
  domainLimitExpense: number,
  domainCurrentExpense: number
): number {
  const domainRemainingCredit = domainLimitExpense - domainCurrentExpense
  return Math.min(walletBalance, domainRemainingCredit)
}

export function isUserBeneficiary(user: UserProfileResponse): boolean {
  return user.isBeneficiary
}

export function isUserExBeneficiary(user: UserProfileResponse, credit: Credit): boolean {
  return user.isBeneficiary && credit.isExpired
}
