import mockdate from 'mockdate'

import { CurrencyEnum, OfferResponseV2 } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as currencyHook from 'shared/currency/useGetCurrencyToDisplay'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useHasEnoughCredit } from './useHasEnoughCredit'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  user: undefined,
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
})

jest.mock('libs/firebase/analytics/analytics')

describe('useHasEnoughCredit', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return false if no offer nor user found', () => {
    const { result } = renderUseHasEnoughCredit()

    expect(result.current).toEqual({ hasEnoughCredit: false })
  })

  it('should return false if the user does not have domainsCredit', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 0, remaining: 2300 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderUseHasEnoughCredit(mockOffer)

    expect(result.current).toEqual({ hasEnoughCredit: false })
  })

  it('should return false if the user does not have enough credit for the offer', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: null },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderUseHasEnoughCredit(mockOffer)

    expect(result.current).toEqual({ hasEnoughCredit: false })
  })

  it('should return true if the user has enough credit for the offer', () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 30000, remaining: 2500 } } },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    const { result } = renderUseHasEnoughCredit(mockOffer)

    expect(result.current).toEqual({ hasEnoughCredit: true })
  })

  it('should return false with message if the user does not have enough credit for the offer in euros but enough credit in Pacific Franc', () => {
    jest
      .spyOn(currencyHook, 'useGetCurrencyToDisplay')
      .mockReturnValueOnce(Currency.PACIFIC_FRANC_SHORT)

    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockUseAuthContext.mockReturnValueOnce({
      user: {
        ...beneficiaryUser,
        domainsCredit: { all: { initial: 15000, remaining: 899 }, digital: null, physical: null },
        currency: CurrencyEnum.XPF,
      },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })

    const testOffer = { ...mockOffer, stocks: [{ ...mockOffer.stocks[0], price: 900 }] }
    const { result } = renderUseHasEnoughCredit(testOffer)

    expect(result.current).toEqual({
      hasEnoughCredit: false,
      message:
        'En raison des conversions monétaires, ton crédit disponible ne couvre pas le prix total.',
    })
  })
})

const renderUseHasEnoughCredit = (offer?: Pick<OfferResponseV2, 'stocks' | 'expenseDomains'>) =>
  renderHook(() => useHasEnoughCredit(offer), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
