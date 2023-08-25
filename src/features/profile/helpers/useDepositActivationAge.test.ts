import { useAuthContext } from 'features/auth/context/__mocks__/AuthContext'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { renderHook } from 'tests/utils'

import { useDepositActivationAge } from './useDepositActivationAge'

const defaultContextValue = {
  isUserLoading: false,
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
}

const mockUseAuthContext = useAuthContext.mockReturnValue(defaultContextValue)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('useDepositActivationAge', () => {
  it('should be undefined when user is logged out', () => {
    const { result } = renderHook(useDepositActivationAge)

    expect(result.current).toBeUndefined()
  })

  it('should be undefined when user is loading', () => {
    useAuthContext.mockReturnValueOnce({
      ...defaultContextValue,
      isLoggedIn: true,
      isUserLoading: true,
    })
    const { result } = renderHook(useDepositActivationAge)

    expect(result.current).toBeUndefined()
  })

  it('should be null when user is not beneficiary', () => {
    useAuthContext.mockReturnValueOnce({
      ...defaultContextValue,
      isLoggedIn: true,
      user: nonBeneficiaryUser,
    })
    const { result } = renderHook(useDepositActivationAge)

    expect(result.current).toBeNull()
  })

  it('should return deposit activation age for beneficiary user', () => {
    useAuthContext.mockReturnValueOnce({
      ...defaultContextValue,
      isLoggedIn: true,
      user: beneficiaryUser,
    })

    const { result } = renderHook(useDepositActivationAge)

    expect(result.current).toEqual(18)
  })
})
