import { mocked } from 'ts-jest/utils'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { renderHook } from 'tests/utils'

jest.mock('features/profile/helpers/isUserExBeneficiary')
const mockedIsUserExBeneificiary = mocked(isUserExBeneficiary)

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('useMaxPrice when no user', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: undefined,
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('returns 300 when no user logged in', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user is not beneficiary', () => {
  it('returns 300 when the user is not a beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: nonBeneficiaryUser,
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user under 18', () => {
  it('returns 30 when the user initial credit is 30', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: { ...beneficiaryUser, domainsCredit: { all: { remaining: 10_00, initial: 30_00 } } },
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    expect(renderHook(useMaxPrice).result.current).toEqual(30)
  })

  describe('useMaxPrice when user is ex-benficiary', () => {
    beforeAll(() => {
      mockedIsUserExBeneificiary.mockReturnValue(true)
    })

    it('returns 300 when the user is ex-beneficiary', () => {
      expect(renderHook(useMaxPrice).result.current).toEqual(300)
    })
  })
})
