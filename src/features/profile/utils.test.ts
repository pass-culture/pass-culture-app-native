import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseV2 } from 'features/profile/components/types'

import { computeRemainingCredit, computeWalletBalance, sortExpenses } from './utils'

const expensesV1: Array<Expense> = [
  { current: 50, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 100, domain: ExpenseDomain.All, limit: 500 },
  { current: 50, domain: ExpenseDomain.Physical, limit: 200 },
]

const expensesV2: Array<ExpenseV2> = [
  { current: 150, domain: ExpenseDomain.All, limit: 300 },
  { current: 100, domain: ExpenseDomain.Digital, limit: 200 },
]

describe('profile utils', () => {
  describe('sortExpenses', () => {
    it('should sort version 1 expenses in the right order', () => {
      expect(sortExpenses(1, expensesV1)).toEqual([
        { current: 50, domain: ExpenseDomain.Digital, limit: 100 },
        { current: 50, domain: ExpenseDomain.Physical, limit: 200 },
        { current: 100, domain: ExpenseDomain.All, limit: 500 },
      ])
    })

    it('should sort version 2 expenses in the right order', () => {
      expect(sortExpenses(2, expensesV2)).toEqual([
        { current: 100, domain: ExpenseDomain.Digital, limit: 200 },
        { current: 150, domain: ExpenseDomain.All, limit: 300 },
      ])
    })
  })

  describe('computeWalletBalance', () => {
    it('should return the right amount according to expenses', () => {
      expect(computeWalletBalance(expensesV1)).toBe(400)
      expect(computeWalletBalance(expensesV2)).toBe(150)
    })
  })

  describe('computeRemainingCredit', () => {
    const domainLimitExpense = 200
    const domainCurrentExpense = 100

    it('should return the right amount when walletBalance > (domainLimit - domainAmount)', () => {
      expect(computeRemainingCredit(400, domainLimitExpense, domainCurrentExpense)).toBe(100)
    })

    it('should return the right amount when walletBalance < (domainLimit - domainAmount)', () => {
      expect(computeRemainingCredit(85, domainLimitExpense, domainCurrentExpense)).toBe(85)
    })
  })
})
