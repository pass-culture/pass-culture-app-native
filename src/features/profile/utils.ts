import _ from 'lodash'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseDomainOrderV1, ExpenseDomainOrderV2 } from 'features/profile/components/types'
import { ExpenseV2 } from 'features/profile/components/types'

/**
 * Formats an iso date to a slashed french date.
 * @param ISOBirthday the birthday date into the ISO 8601 format %Y-%m-%dT%H:%M:%S
 */
export function computeEligibilityExpiracy(ISOBirthday: string) {
  const date = new Date(ISOBirthday)
  date.setFullYear(date.getFullYear() + 19)
  date.setDate(date.getDate() - 1)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  return date
}

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
