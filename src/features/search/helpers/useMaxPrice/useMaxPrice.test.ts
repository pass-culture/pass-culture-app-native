import { mocked } from 'ts-jest/utils'

import { useAuthContext } from 'features/auth/AuthContext'
import { isUserExBeneficiary } from 'features/profile/utils'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { renderHook } from 'tests/utils'

jest.mock('features/profile/utils')
const mockedIsUserExBeneificiary = mocked(isUserExBeneficiary)

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('useMaxPrice when no user', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: undefined,
    })
  })

  it('returns 300 when no user logged in', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user is not beneficiary', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: nonBeneficiaryUser,
    })
  })

  it('returns 300 when the user is not a beneficiary', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user under 18', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      user: { ...beneficiaryUser, domainsCredit: { all: { remaining: 10_00, initial: 30_00 } } },
    })
  })

  it('returns 30 when the user initial credit is 30', () => {
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
