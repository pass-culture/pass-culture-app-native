import mockdate from 'mockdate'

import { ExpenseDomain } from 'api/gen'

import { hasEnoughCredit } from './hasEnoughCredit'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

jest.mock('libs/firebase/analytics/analytics')

describe('hasEnoughCredit', () => {
  it.each`
    domains                | price | domainsCredit
    ${[]}                  | ${0}  | ${{}}
    ${[ExpenseDomain.all]} | ${0}  | ${{}}
    ${[ExpenseDomain.all]} | ${0}  | ${{ all: { initial: 10000, remaining: 10 } }}
    ${[ExpenseDomain.all]} | ${0}  | ${{ all: { initial: 10000, remaining: 0 } }}
  `('any user can book free offers', ({ domains, price, domainsCredit }) => {
    expect(hasEnoughCredit(domains, price, domainsCredit)).toBeTruthy()
  })

  it('should return true if the price is falsy', () => {
    const domainsCredit = { [ExpenseDomain.all]: { initial: 50000, remaining: 5000 } }
    const domains = [ExpenseDomain.all]

    expect(hasEnoughCredit(domains, null, domainsCredit)).toBe(true)
    expect(hasEnoughCredit(domains, undefined, domainsCredit)).toBe(true)
    expect(hasEnoughCredit(domains, 0, domainsCredit)).toBe(true)
  })

  it('should return false if domainsCredit is falsy', () => {
    const price = 100
    const domains = [ExpenseDomain.all]

    expect(hasEnoughCredit(domains, price, null)).toBeFalsy()
    expect(hasEnoughCredit(domains, price, undefined)).toBeFalsy()
  })

  it('should be bookable if it respects all the domains remaining credit - before generalisation', () => {
    const domainsCredit = {
      [ExpenseDomain.all]: { initial: 50000, remaining: 5000 },
      [ExpenseDomain.digital]: { initial: 20000, remaining: 2000 },
      [ExpenseDomain.physical]: { initial: 20000, remaining: 1000 },
    }

    let domains = [ExpenseDomain.all]

    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBe(true)
    expect(hasEnoughCredit(domains, 6000, domainsCredit)).toBe(false)

    domains = [ExpenseDomain.all, ExpenseDomain.digital]

    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBe(false)
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBe(true)

    domains = [ExpenseDomain.all, ExpenseDomain.digital, ExpenseDomain.physical]

    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBe(false)
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBe(false)
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBe(true)
  })

  it('should be bookable if it respects all the domains remaining credit - after generalisation', () => {
    const domainsCredit = {
      [ExpenseDomain.all]: { initial: 30000, remaining: 3000 },
      [ExpenseDomain.digital]: { initial: 10000, remaining: 1000 },
      [ExpenseDomain.physical]: null,
    }

    let domains = [ExpenseDomain.all]

    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBe(true)
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBe(false)

    domains = [ExpenseDomain.all, ExpenseDomain.digital]

    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBe(false)
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBe(true)

    domains = [ExpenseDomain.all, ExpenseDomain.digital, ExpenseDomain.physical]

    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBe(false)
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBe(true)
  })
})
