import _ from 'lodash'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseDomainOrder } from 'features/profile/components/types'
import { ExpenseV2 } from 'features/profile/components/types'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

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

export function sortExpenses(expenses: Expense[]) {
  return _.sortBy(expenses, function (expense: Expense) {
    return ExpenseDomainOrder[expense.domain]
  })
}

export function computeRemainingCredit(expenses: Expense[] | ExpenseV2[]): number {
  const allExpense = expenses.find((expense) => expense.domain === ExpenseDomain.All)
  return allExpense ? convertCentsToEuros(allExpense.limit - allExpense.current) : 0
}
