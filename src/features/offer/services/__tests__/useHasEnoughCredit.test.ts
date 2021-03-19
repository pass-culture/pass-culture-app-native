import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { ExpenseDomain, UserProfileResponse } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'

import { hasEnoughCredit, useHasEnoughCredit } from '../useHasEnoughCredit'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

let mockedOffer: Partial<OfferAdaptedResponse> | undefined = undefined
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

let mockedUser: Partial<UserProfileResponse> | undefined = undefined
jest.mock('features/home/api', () => ({
  useUserProfileInfo: () => ({
    data: mockedUser,
  }),
}))

describe('hasEnoughCredit', () => {
  it.each`
    domains                | price | domainsCredit                                 | enoughCredit
    ${[]}                  | ${0}  | ${{}}                                         | ${true}
    ${[ExpenseDomain.All]} | ${0}  | ${{}}                                         | ${true}
    ${[ExpenseDomain.All]} | ${0}  | ${{ all: { initial: 10000, remaining: 10 } }} | ${true}
    ${[ExpenseDomain.All]} | ${0}  | ${{ all: { initial: 10000, remaining: 0 } }}  | ${true}
  `('any user can book free offers', ({ domains, price, domainsCredit, enoughCredit }) => {
    expect(hasEnoughCredit(domains, price, domainsCredit)).toEqual(enoughCredit)
  })

  it('should be bookable if it respects all the domains remaining credit - before generalisation', () => {
    const domainsCredit = {
      [ExpenseDomain.All]: { initial: 50000, remaining: 5000 },
      [ExpenseDomain.Digital]: { initial: 20000, remaining: 2000 },
      [ExpenseDomain.Physical]: { initial: 20000, remaining: 1000 },
    }

    let domains = [ExpenseDomain.All]
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, 6000, domainsCredit)).toBeFalsy()

    domains = [ExpenseDomain.All, ExpenseDomain.Digital]
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBeTruthy()

    domains = [ExpenseDomain.All, ExpenseDomain.Digital, ExpenseDomain.Physical]
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()
  })

  it('should be bookable if it respects all the domains remaining credit - after generalisation', () => {
    const domainsCredit = {
      [ExpenseDomain.All]: { initial: 30000, remaining: 3000 },
      [ExpenseDomain.Digital]: { initial: 10000, remaining: 1000 },
      [ExpenseDomain.Physical]: null,
    }

    let domains = [ExpenseDomain.All]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()

    domains = [ExpenseDomain.All, ExpenseDomain.Digital]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()

    domains = [ExpenseDomain.All, ExpenseDomain.Digital, ExpenseDomain.Physical]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()
  })
})

describe('useHasEnoughCredit', () => {
  it('should return false if no offer nor user found', () => {
    mockedOffer = undefined
    mockedUser = undefined
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return false if the user does not have domainsCredit', () => {
    mockedOffer = mockOffer
    mockedUser = { domainsCredit: null }
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return false if the user does not have enough credit for the offer', () => {
    mockedOffer = mockOffer
    mockedUser = { domainsCredit: { all: { initial: 30000, remaining: 2300 } } }
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return true if the user has enough credit for the offer', () => {
    mockedOffer = mockOffer
    mockedUser = { domainsCredit: { all: { initial: 30000, remaining: 2500 } } }
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeTruthy()
  })
})
