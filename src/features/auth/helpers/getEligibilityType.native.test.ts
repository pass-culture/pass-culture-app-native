import { EligibilityType, QFBonificationStatus, UserProfileResponse } from 'api/gen'
import { getAge } from 'shared/user/getAge'

import { getEligibilityType, UserEligibilityType } from './getEligibilityType'

jest.mock('shared/user/getAge')

const mockedGetAge = getAge as jest.Mock

const buildUser = (overrides?: Partial<UserProfileResponse>): UserProfileResponse =>
  ({
    birthDate: '2000-01-01',
    eligibility: null,
    qfBonificationStatus: null,
    ...overrides,
  }) as UserProfileResponse

describe('getEligibilityType', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetAge.mockReturnValue(18)
  })

  it('should return NOT_ELIGIBLE by default', () => {
    const result = getEligibilityType(buildUser())

    expect(result).toBe(UserEligibilityType.NOT_ELIGIBLE)
  })

  describe('V2', () => {
    it('should return ELIGIBLE_CREDIT_V2_18', () => {
      const result = getEligibilityType(buildUser({ eligibility: EligibilityType['age-18'] }))

      expect(result).toBe(UserEligibilityType.ELIGIBLE_CREDIT_V2_18)
    })
  })

  describe('V3', () => {
    it('should return ELIGIBLE_CREDIT_V3_15', () => {
      mockedGetAge.mockReturnValueOnce(15)
      const result = getEligibilityType(buildUser({ eligibility: EligibilityType.free }))

      expect(result).toBe(UserEligibilityType.ELIGIBLE_CREDIT_V3_15)
    })

    it('should return ELIGIBLE_CREDIT_V3_16', () => {
      mockedGetAge.mockReturnValueOnce(16)
      const result = getEligibilityType(buildUser({ eligibility: EligibilityType.free }))

      expect(result).toBe(UserEligibilityType.ELIGIBLE_CREDIT_V3_16)
    })

    it('should return ELIGIBLE_CREDIT_V3_17', () => {
      mockedGetAge.mockReturnValueOnce(17)
      const result = getEligibilityType(buildUser({ eligibility: EligibilityType['age-17-18'] }))

      expect(result).toBe(UserEligibilityType.ELIGIBLE_CREDIT_V3_17)
    })

    it('should return ELIGIBLE_CREDIT_V3_18', () => {
      mockedGetAge.mockReturnValueOnce(18)
      const result = getEligibilityType(buildUser({ eligibility: EligibilityType['age-17-18'] }))

      expect(result).toBe(UserEligibilityType.ELIGIBLE_CREDIT_V3_18)
    })
  })

  describe('BONUS', () => {
    it('should override everything', () => {
      const result = getEligibilityType(
        buildUser({
          eligibility: EligibilityType.free,
          qfBonificationStatus: QFBonificationStatus.eligible,
        })
      )

      expect(result).toBe(UserEligibilityType.ELIGIBLE_BONUS)
    })
  })
})
