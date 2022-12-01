import mockdate from 'mockdate'

import { ExpenseDomain, OfferResponse } from 'api/gen'
import * as Auth from 'features/auth/AuthContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { beneficiaryUser } from 'fixtures/user'
import { renderHook } from 'tests/utils'

import { hasEnoughCredit, useHasEnoughCredit } from './useHasEnoughCredit'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

let mockedOffer: Partial<OfferResponse> | undefined = undefined
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  user: undefined,
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
})

describe('hasEnoughCredit', () => {
  it.each`
    domains                | price | domainsCredit                                 | enoughCredit
    ${[]}                  | ${0}  | ${{}}                                         | ${true}
    ${[ExpenseDomain.all]} | ${0}  | ${{}}                                         | ${true}
    ${[ExpenseDomain.all]} | ${0}  | ${{ all: { initial: 10000, remaining: 10 } }} | ${true}
    ${[ExpenseDomain.all]} | ${0}  | ${{ all: { initial: 10000, remaining: 0 } }}  | ${true}
  `('any user can book free offers', ({ domains, price, domainsCredit, enoughCredit }) => {
    expect(hasEnoughCredit(domains, price, domainsCredit)).toEqual(enoughCredit)
  })

  it('should return true if the price is falsy', () => {
    const domainsCredit = { [ExpenseDomain.all]: { initial: 50000, remaining: 5000 } }
    const domains = [ExpenseDomain.all]

    expect(hasEnoughCredit(domains, null, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, undefined, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, 0, domainsCredit)).toBeTruthy()
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
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, 6000, domainsCredit)).toBeFalsy()

    domains = [ExpenseDomain.all, ExpenseDomain.digital]
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBeTruthy()

    domains = [ExpenseDomain.all, ExpenseDomain.digital, ExpenseDomain.physical]
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 2000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()
  })

  it('should be bookable if it respects all the domains remaining credit - after generalisation', () => {
    const domainsCredit = {
      [ExpenseDomain.all]: { initial: 30000, remaining: 3000 },
      [ExpenseDomain.digital]: { initial: 10000, remaining: 1000 },
      [ExpenseDomain.physical]: null,
    }

    let domains = [ExpenseDomain.all]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeTruthy()
    expect(hasEnoughCredit(domains, 5000, domainsCredit)).toBeFalsy()

    domains = [ExpenseDomain.all, ExpenseDomain.digital]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()

    domains = [ExpenseDomain.all, ExpenseDomain.digital, ExpenseDomain.physical]
    expect(hasEnoughCredit(domains, 3000, domainsCredit)).toBeFalsy()
    expect(hasEnoughCredit(domains, 1000, domainsCredit)).toBeTruthy()
  })
})

describe('useHasEnoughCredit', () => {
  it('should return false if no offer nor user found', () => {
    mockedOffer = undefined
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return false if the user does not have domainsCredit', () => {
    mockedOffer = mockOffer
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 0, remaining: 2300 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return false if the user does not have enough credit for the offer', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: null },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeFalsy()
  })

  it('should return true if the user has enough credit for the offer', () => {
    mockedOffer = mockOffer
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 30000, remaining: 2500 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(10))

    expect(result.current).toBeTruthy()
  })
})
