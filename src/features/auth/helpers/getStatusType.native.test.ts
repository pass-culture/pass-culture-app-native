import { DepositType, UserProfileResponse, YoungStatusType } from 'api/gen'
import { logUserStatusTypeFallback } from 'features/profile/helpers/logUserStatusTypeFallback'
import { getAge } from 'shared/user/getAge'

import { getStatusType, UserStatusType } from './getStatusType'

jest.mock('features/profile/helpers/logUserStatusTypeFallback')

jest.mock('shared/user/getAge')
const mockedGetAge = getAge as jest.Mock
const mockAge = (age: number) => mockedGetAge.mockReturnValue(age)

const buildUser = ({
  statusType,
  depositType,
  isBeneficiary,
}: {
  statusType: YoungStatusType | string
  depositType?: DepositType
  isBeneficiary?: boolean
}): UserProfileResponse =>
  ({ status: { statusType }, depositType, isBeneficiary }) as UserProfileResponse

describe('getStatusType', () => {
  it('should return BENEFICIARY', () => {
    mockAge(18)
    const user = buildUser({ statusType: YoungStatusType.beneficiary })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.BENEFICIARY)
  })

  it('should return ELIGIBLE_AND_BENEFICIARY when user eligible and isBeneficiary', () => {
    mockAge(18)
    const user = buildUser({
      statusType: YoungStatusType.eligible,
      depositType: DepositType.GRANT_17_18,
      isBeneficiary: true,
    })

    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.ELIGIBLE_AND_BENEFICIARY)
  })

  it('should return ELIGIBLE_AND_FREE_BENEFICIARY when user eligible with free deposit', () => {
    const user = buildUser({
      statusType: YoungStatusType.eligible,
      depositType: DepositType.GRANT_FREE,
    })

    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.ELIGIBLE_AND_FREE_BENEFICIARY)
  })

  it('should return EX_BENEFICIARY', () => {
    mockAge(21)
    const user = buildUser({ statusType: YoungStatusType.ex_beneficiary })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.EX_BENEFICIARY)
  })

  it('should return ELIGIBLE', () => {
    mockAge(18)
    const user = buildUser({ statusType: YoungStatusType.eligible })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.ELIGIBLE)
  })

  it('should return GENERAL_PUBLIC', () => {
    mockAge(25)
    const user = buildUser({ statusType: YoungStatusType.non_eligible })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.GENERAL_PUBLIC)
  })

  it('should return SUSPENDED', () => {
    mockAge(18)
    const user = buildUser({ statusType: YoungStatusType.suspended })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.SUSPENDED)
  })

  it('should return UNKNOWN when statusType is unknown', () => {
    mockAge(18)
    const user = buildUser({ statusType: 'unexpected_status' })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.UNKNOWN)
  })

  it('should log fallback when status type is unknown', () => {
    const user = buildUser({ statusType: 'unexpected_status' })
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.UNKNOWN)

    expect(logUserStatusTypeFallback).toHaveBeenCalledTimes(1)
  })
})
