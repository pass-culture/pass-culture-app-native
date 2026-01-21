import mockdate from 'mockdate'

import { ExpenseDomain } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import {
  checkHasEnoughCredit,
  convertDomainCreditToPacificFranc,
  getMinRemainingCreditForOffer,
  hasEnoughCredit,
} from 'features/offerRefacto/helpers'
import { beneficiaryUser } from 'fixtures/user'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

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

describe('convertDomainCreditToPacificFranc', () => {
  it('should convert domain credit from euro cents to pacific franc', () => {
    const creditInEuroCents = { initial: 15000, remaining: 5500 }
    const rate = 0.00838

    const convertedCredit = convertDomainCreditToPacificFranc(creditInEuroCents, rate)

    expect(convertedCredit).toEqual({ initial: 17900, remaining: 6565 })
  })
})

describe('checkHasEnoughCredit', () => {
  const euroToPacificFrancRate = 0.00838

  it('should return false if the user is missing', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.EURO,
      euroToPacificFrancRate,
    })

    expect(result).toEqual({ hasEnoughCredit: false })
  })

  it('should return false if the user credit is missing', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.EURO,
      euroToPacificFrancRate,
      user: { ...beneficiaryUser, domainsCredit: null },
    })

    expect(result).toEqual({ hasEnoughCredit: false })
  })

  it('should return true if the user has enough credit in EURO', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.EURO,
      euroToPacificFrancRate,
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 15000, remaining: 10000 } } },
    })

    expect(result).toEqual({ hasEnoughCredit: true })
  })

  it('should return true if the user has enough credit in XPF', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.PACIFIC_FRANC_SHORT,
      euroToPacificFrancRate,
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 15000, remaining: 10000 } } },
    })

    expect(result).toEqual({ hasEnoughCredit: true })
  })

  it('should return a specific error message if the user has enough credit in XPF but not in EUR', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.PACIFIC_FRANC_SHORT,
      euroToPacificFrancRate,
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 15000, remaining: 499 } } },
    })

    expect(result).toEqual({
      hasEnoughCredit: false,
      message:
        'En raison des conversions monétaires, ton crédit disponible ne couvre pas le prix total.',
    })
  })

  it('should return false if the user has not enough credit in XPF and in EUR', () => {
    const result = checkHasEnoughCredit({
      offer: { stocks: offerResponseSnap.stocks, expenseDomains: offerResponseSnap.expenseDomains },
      currency: Currency.PACIFIC_FRANC_SHORT,
      euroToPacificFrancRate,
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 15000, remaining: 490 } } },
    })

    expect(result).toEqual({
      hasEnoughCredit: false,
    })
  })
})

describe('getMinRemainingCreditForOffer', () => {
  const domainsCredit = {
    all: { initial: 150, remaining: 100 },
    digital: { initial: 50, remaining: 25 },
    physical: { initial: 100, remaining: 75 },
  }

  it('should return 0 if domains credit are undefined', () => {
    expect(getMinRemainingCreditForOffer([ExpenseDomain.all], undefined)).toEqual(0)
  })

  it('should return the minimum credit among multiple domains', () => {
    const expenseDomains = [ExpenseDomain.digital, ExpenseDomain.physical]

    expect(getMinRemainingCreditForOffer(expenseDomains, domainsCredit)).toEqual(25)
  })

  it('should return the credit if only one domain is provided', () => {
    const expenseDomains = [ExpenseDomain.all]

    expect(getMinRemainingCreditForOffer(expenseDomains, domainsCredit)).toEqual(100)
  })

  it('should ignore domains that do not exist in domainsCredit', () => {
    const incompleteCredits = {
      all: { initial: 150, remaining: 100 },
    }
    const expenseDomains = [ExpenseDomain.all, ExpenseDomain.digital]

    expect(getMinRemainingCreditForOffer(expenseDomains, incompleteCredits)).toEqual(100)
  })

  it('should return 0 if none of the requested domains have a defined credit', () => {
    const incompleteCredits = { all: { initial: 150, remaining: 100 } }
    const expenseDomains = [ExpenseDomain.digital]

    expect(getMinRemainingCreditForOffer(expenseDomains, incompleteCredits)).toEqual(0)
  })

  it('should handle correctly credits that are 0', () => {
    const creditsWithZero = {
      all: { initial: 150, remaining: 100 },
      digital: { initial: 50, remaining: 0 },
    }
    const expenseDomains = [ExpenseDomain.all, ExpenseDomain.digital]

    expect(getMinRemainingCreditForOffer(expenseDomains, creditsWithZero)).toEqual(0)
  })

  it('should filter out null or undefined values in domains credit', () => {
    const creditsWithNull = {
      all: { initial: 150, remaining: 100 },
      digital: null,
      physical: undefined,
    }
    const expenseDomains = [ExpenseDomain.all, ExpenseDomain.digital, ExpenseDomain.physical]

    expect(getMinRemainingCreditForOffer(expenseDomains, creditsWithNull)).toEqual(100)
  })
})
