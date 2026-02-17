import { DepositType, EligibilityType, YoungStatusType, UserProfileResponse } from 'api/gen'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getAge } from 'shared/user/getAge'

import { getUserProfileState } from './getUserProfileState'

jest.mock('shared/user/getAge')
jest.mock('features/profile/helpers/getIsDepositExpired')

const mockedGetAge = getAge as jest.Mock
const mockAge = (age: number) => mockedGetAge.mockReturnValue(age)

const mockedIsDepositExpired = getIsDepositExpired as jest.Mock

const buildUser = (overrides?: Partial<UserProfileResponse>): UserProfileResponse =>
  ({
    birthDate: '2000-01-01',
    depositExpirationDate: null,
    depositType: null,
    isEligibleForBeneficiaryUpgrade: false,
    eligibility: null,
    isBeneficiary: false,
    qfBonificationStatus: null,
    status: { statusType: YoungStatusType.non_eligible },
    ...overrides,
  }) as UserProfileResponse

describe('getUserProfileState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAge(18)
    mockedIsDepositExpired.mockReturnValue(false)
  })

  it('should return GENERAL_PUBLIC + NO_CREDIT + NOT_ELIGIBLE by default', () => {
    const user = buildUser()

    expect(getUserProfileState(user)).toEqual({
      statusType: UserStatusType.GENERAL_PUBLIC,
      creditType: UserCreditType.NO_CREDIT,
      eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
    })
  })

  describe('CREDIT V2', () => {
    it('should return ELIGIBLE + NO_CREDIT + ELIGIBLE_CREDIT_V2_18 when user is eighteen with no deposit', () => {
      mockAge(18)
      const user = buildUser({
        status: { statusType: YoungStatusType.eligible },
        depositType: DepositType.GRANT_15_17,
        eligibility: EligibilityType['age-18'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.ELIGIBLE,
        creditType: UserCreditType.NO_CREDIT,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V2_18,
      })
    })
  })

  describe('CREDIT V3', () => {
    it('should return ELIGIBLE + NO_CREDIT + ELIGIBLE_CREDIT_V3_15 when user is fifteen with no deposit', () => {
      mockAge(15)
      const user = buildUser({
        status: { statusType: YoungStatusType.eligible },
        depositType: null,
        eligibility: EligibilityType['free'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.ELIGIBLE,
        creditType: UserCreditType.NO_CREDIT,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15,
      })
    })

    it('should return BENEFICIARY + CREDIT_V3_15 + ELIGIBLE_CREDIT_V3_15 when user is fifteen with free deposit', () => {
      mockAge(15)
      const user = buildUser({
        status: { statusType: YoungStatusType.beneficiary },
        depositType: DepositType.GRANT_FREE,
        eligibility: EligibilityType['free'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.BENEFICIARY,
        creditType: UserCreditType.CREDIT_V3_15,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15,
      })
    })

    it('should return ELIGIBLE + NO_CREDIT + ELIGIBLE_CREDIT_V3_16 when user is sixteen with no deposit', () => {
      mockAge(16)
      const user = buildUser({
        status: { statusType: YoungStatusType.eligible },
        depositType: null,
        eligibility: EligibilityType['free'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.ELIGIBLE,
        creditType: UserCreditType.NO_CREDIT,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
      })
    })

    it('should return BENEFICIARY + CREDIT_V3_16 + ELIGIBLE_CREDIT_V3_16 when user is sixteen with free deposit', () => {
      mockAge(16)
      const user = buildUser({
        status: { statusType: YoungStatusType.beneficiary },
        depositType: DepositType.GRANT_FREE,
        eligibility: EligibilityType['free'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.BENEFICIARY,
        creditType: UserCreditType.CREDIT_V3_16,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
      })
    })

    it('should return ELIGIBLE + NO_CREDIT + ELIGIBLE_CREDIT_V3_17 when user is seventeen with no deposit', () => {
      mockAge(17)
      const user = buildUser({
        status: { statusType: YoungStatusType.eligible },
        depositType: null,
        eligibility: EligibilityType['age-17-18'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.ELIGIBLE,
        creditType: UserCreditType.NO_CREDIT,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_17,
      })
    })

    it('should return BENEFICIARY + CREDIT_V3_17 + ELIGIBLE_CREDIT_V3_17 when user is seventeen with free deposit', () => {
      mockAge(17)
      const user = buildUser({
        status: { statusType: YoungStatusType.beneficiary },
        depositType: DepositType.GRANT_17_18,
        eligibility: EligibilityType['age-17-18'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.BENEFICIARY,
        creditType: UserCreditType.CREDIT_V3_17,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_17,
      })
    })

    it('should return ELIGIBLE + NO_CREDIT + ELIGIBLE_CREDIT_V3_18 when user is eighteen with no deposit', () => {
      mockAge(18)
      const user = buildUser({
        status: { statusType: YoungStatusType.eligible },
        depositType: null,
        eligibility: EligibilityType['age-17-18'],
      })

      expect(getUserProfileState(user)).toEqual({
        statusType: UserStatusType.ELIGIBLE,
        creditType: UserCreditType.NO_CREDIT,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_18,
      })
    })
  })

  it('should return BENEFICIARY + CREDIT_V3_18 + ELIGIBLE_CREDIT_V3_18 when user is eighteen with free deposit', () => {
    mockAge(18)
    const user = buildUser({
      status: { statusType: YoungStatusType.beneficiary },
      depositType: DepositType.GRANT_17_18,
      eligibility: EligibilityType['age-17-18'],
    })

    expect(getUserProfileState(user)).toEqual({
      statusType: UserStatusType.BENEFICIARY,
      creditType: UserCreditType.CREDIT_V3_18,
      eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_18,
    })
  })

  it('should return SUSPENDED + CREDIT_EXPIRED + NOT_ELIGIBLE when expired', () => {
    mockedIsDepositExpired.mockReturnValueOnce(true)

    const user = buildUser({
      status: { statusType: YoungStatusType.suspended },
      depositType: null,
      eligibility: null,
    })

    expect(getUserProfileState(user)).toEqual({
      statusType: UserStatusType.SUSPENDED,
      creditType: UserCreditType.CREDIT_EXPIRED,
      eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
    })
  })
})
