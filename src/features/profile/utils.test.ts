import { Expense, ExpenseDomain } from 'api/gen/api'

import { computeEligibilityExpiracy, computeRemainingCredit, sortExpenses } from './utils'

describe('computeEligibilityExpiracy', () => {
  it.each([
    // [birthday, expiracy]
    ['2003-01-13T00:00:00', '2022-01-12T23:59:59.000Z'], // check year variation
    ['2003-02-01T00:00:00', '2022-01-31T23:59:59.000Z'], // check month variation
  ])('', (birthday, expectedExpiracy) => {
    const expiracy = computeEligibilityExpiracy(birthday)

    expect(expiracy.toISOString()).toEqual(expectedExpiracy)
  })

  it('sortExpenses - should sort expenses in the right order', () => {
    const expenses: Array<Expense> = [
      { current: 60, domain: ExpenseDomain.Digital, limit: 100 },
      { current: 100, domain: ExpenseDomain.All, limit: 200 },
      { current: 0, domain: ExpenseDomain.Physical, limit: 200 },
    ]

    expect(sortExpenses(expenses)).toEqual([
      { current: 100, domain: ExpenseDomain.All, limit: 200 },
      { current: 0, domain: ExpenseDomain.Physical, limit: 200 },
      { current: 60, domain: ExpenseDomain.Digital, limit: 100 },
    ])
  })

  it('computeRemainingCredit - should return the right amount according to expenses', () => {
    const expenses: Array<Expense> = [
      { current: 600, domain: ExpenseDomain.Digital, limit: 1000 },
      { current: 1500, domain: ExpenseDomain.All, limit: 2000 },
      { current: 0, domain: ExpenseDomain.Physical, limit: 2000 },
    ]
    expect(computeRemainingCredit(expenses)).toBe(5)
  })
})
