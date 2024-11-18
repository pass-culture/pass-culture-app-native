import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

jest.mock('features/profile/helpers/isUserExBeneficiary')
const mockedIsUserExBeneficiary = jest.mocked(isUserExBeneficiary)

jest.mock('features/auth/context/AuthContext')

describe('useMaxPrice when no user', () => {
  beforeAll(() => {
    mockAuthContextWithoutUser()
  })

  it('returns 300 when no user logged in', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300_00)
  })
})

describe('useMaxPrice when user is not beneficiary', () => {
  it('returns 300 when the user is not a beneficiary', () => {
    mockAuthContextWithUser(nonBeneficiaryUser)

    expect(renderHook(useMaxPrice).result.current).toEqual(300_00)
  })
})

describe('useMaxPrice when user under 18', () => {
  it('returns 30 when the user initial credit is 30', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      domainsCredit: { all: { remaining: 10_00, initial: 30_00 } },
    })

    expect(renderHook(useMaxPrice).result.current).toEqual(30_00)
  })

  describe('useMaxPrice when user is ex-beneficiary', () => {
    beforeAll(() => {
      mockedIsUserExBeneficiary.mockReturnValue(true)
    })

    it('returns 300 when the user is ex-beneficiary', () => {
      expect(renderHook(useMaxPrice).result.current).toEqual(300_00)
    })
  })
})
