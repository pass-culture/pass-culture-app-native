import mockdate from 'mockdate'

import { ExpenseDomain } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { beneficiaryUser } from 'fixtures/user'
import { renderHook } from 'tests/utils'

import { hasEnoughCredit, useHasEnoughCredit } from './useHasEnoughCredit'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  user: undefined,
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

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

jest.mock('libs/firebase/analytics/analytics')

describe('useHasEnoughCredit', () => {
  it('should return false if no offer nor user found', () => {
    const { result } = renderHook(() => useHasEnoughCredit())

    expect(result.current).toBe(false)
  })

  it('should return false if the user does not have domainsCredit', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 0, remaining: 2300 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(mockOffer))

    expect(result.current).toBe(false)
  })

  it('should return false if the user does not have enough credit for the offer', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: null },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(mockOffer))

    expect(result.current).toBe(false)
  })

  it('should return true if the user has enough credit for the offer', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 30000, remaining: 2500 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderHook(() => useHasEnoughCredit(mockOffer))

    expect(result.current).toBe(true)
  })
})
