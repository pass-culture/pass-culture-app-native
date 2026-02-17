import { EligibilityType, UserProfileResponse } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { getAge } from 'shared/user/getAge'

import { getUserStatus, UserStatus } from './getUserStatus'

jest.mock('shared/user/getAge')
const mockedGetAge = getAge as jest.Mock

const simuleUserFromApi = (user: UserProfileResponseWithoutSurvey): UserProfileResponse => {
  const { computedStatus: _computedStatus, ...rest } = user
  return rest as UserProfileResponse
}

describe('getUserStatus', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should return FIFTEEN non beneficiary eligible (free)', () => {
    mockedGetAge.mockReturnValueOnce(15)
    const user = simuleUserFromApi(nonBeneficiaryUser)
    user.eligibility = EligibilityType['free']

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.V3_FIFTEEN_NON_BENEFICIARY_ELIGIBLE_FREE)
  })

  it('should return SIXTEEN non beneficiary eligible (free)', () => {
    mockedGetAge.mockReturnValueOnce(16)
    const user = simuleUserFromApi(nonBeneficiaryUser)
    user.eligibility = EligibilityType['free']

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.V3_SIXTEEN_NON_BENEFICIARY_ELIGIBLE_FREE)
  })

  it('should return SEVENTEEN eligible (age-17-18)', () => {
    mockedGetAge.mockReturnValueOnce(17)
    const user = simuleUserFromApi(nonBeneficiaryUser)
    user.eligibility = EligibilityType['age-17-18']

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.V3_SEVENTEEN_NON_BENEFICIARY_ELIGIBLE)
  })

  it('should return EIGHTEEN eligible (age-17-18)', () => {
    mockedGetAge.mockReturnValueOnce(18)
    const user = simuleUserFromApi(nonBeneficiaryUser)
    user.eligibility = EligibilityType['age-17-18']

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.V3_EIGHTEEN_NON_BENEFICIARY_ELIGIBLE)
  })

  it('should return GENERAL_PUBLIC for non beneficiary above 18', () => {
    mockedGetAge.mockReturnValueOnce(19)
    const user = simuleUserFromApi(nonBeneficiaryUser)

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.GENERAL_PUBLIC)
  })

  it('should not return GENERAL_PUBLIC if beneficiary', () => {
    mockedGetAge.mockReturnValueOnce(19)
    const user = simuleUserFromApi(beneficiaryUser)
    user.isBeneficiary = true

    const result = getUserStatus(user)

    expect(result).not.toBe(UserStatus.GENERAL_PUBLIC)
  })

  it('should return UNKNOWN if conditions are not met', () => {
    mockedGetAge.mockReturnValueOnce(15)
    const user = simuleUserFromApi(nonBeneficiaryUser)
    user.eligibility = EligibilityType['age-17-18']

    const result = getUserStatus(user)

    expect(result).toBe(UserStatus.UNKNOWN)
  })
})
