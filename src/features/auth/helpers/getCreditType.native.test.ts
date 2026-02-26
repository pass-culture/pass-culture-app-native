import { DepositType, UserProfileResponse } from 'api/gen'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getAge } from 'shared/user/getAge'

import { getCreditType, UserCreditType } from './getCreditType'

jest.mock('shared/user/getAge')
jest.mock('features/profile/helpers/getIsDepositExpired')

const mockedGetAge = getAge as jest.Mock
const mockedIsDepositExpired = getIsDepositExpired as jest.Mock

const buildUser = (overrides?: Partial<UserProfileResponse>): UserProfileResponse =>
  ({
    birthDate: '2000-01-01',
    depositExpirationDate: null,
    depositType: null,
    isEligibleForBeneficiaryUpgrade: false,
    ...overrides,
  }) as UserProfileResponse

describe('getCreditType', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetAge.mockReturnValue(18)
    mockedIsDepositExpired.mockReturnValue(false)
  })

  it('should return NO_CREDIT by default', () => {
    const result = getCreditType(buildUser())

    expect(result).toBe(UserCreditType.NO_CREDIT)
  })

  describe('CREDIT V2', () => {
    it('should return CREDIT_V2_15', () => {
      mockedGetAge.mockReturnValueOnce(15)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_15_17 }))

      expect(result).toBe(UserCreditType.CREDIT_V2_15)
    })

    it('should return CREDIT_V2_16', () => {
      mockedGetAge.mockReturnValueOnce(16)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_15_17 }))

      expect(result).toBe(UserCreditType.CREDIT_V2_16)
    })

    it('should return CREDIT_V2_17', () => {
      mockedGetAge.mockReturnValueOnce(17)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_15_17 }))

      expect(result).toBe(UserCreditType.CREDIT_V2_17)
    })

    it('should return CREDIT_V2_18', () => {
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_18 }))

      expect(result).toBe(UserCreditType.CREDIT_V2_18)
    })
  })

  describe('CREDIT V3', () => {
    it('should return CREDIT_V3_15', () => {
      mockedGetAge.mockReturnValueOnce(15)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_FREE }))

      expect(result).toBe(UserCreditType.CREDIT_V3_15)
    })

    it('should return CREDIT_V3_16', () => {
      mockedGetAge.mockReturnValueOnce(16)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_FREE }))

      expect(result).toBe(UserCreditType.CREDIT_V3_16)
    })

    it('should return CREDIT_V3_17', () => {
      mockedGetAge.mockReturnValueOnce(17)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_17_18 }))

      expect(result).toBe(UserCreditType.CREDIT_V3_17)
    })

    it('should return CREDIT_V3_18', () => {
      mockedGetAge.mockReturnValueOnce(18)
      const result = getCreditType(
        buildUser({ depositType: DepositType.GRANT_17_18, isEligibleForBeneficiaryUpgrade: false })
      )

      expect(result).toBe(UserCreditType.CREDIT_V3_18)
    })
  })

  describe('EXPIRED', () => {
    it('should override all credits', () => {
      mockedIsDepositExpired.mockReturnValueOnce(true)
      const result = getCreditType(buildUser({ depositType: DepositType.GRANT_18 }))

      expect(result).toBe(UserCreditType.CREDIT_EXPIRED)
    })
  })
})
