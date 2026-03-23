import { UserProfileResponse, YoungStatusType } from 'api/gen'

import { getStatusType, UserStatusType } from './getStatusType'

const buildUser = (statusType: YoungStatusType | string): UserProfileResponse =>
  ({ status: { statusType } }) as UserProfileResponse

describe('getStatusType', () => {
  it('should return BENEFICIARY', () => {
    const user = buildUser(YoungStatusType.beneficiary)
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.BENEFICIARY)
  })

  it('should return EX_BENEFICIARY', () => {
    const user = buildUser(YoungStatusType.ex_beneficiary)
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.EX_BENEFICIARY)
  })

  it('should return ELIGIBLE', () => {
    const user = buildUser(YoungStatusType.eligible)
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.ELIGIBLE)
  })

  it('should return GENERAL_PUBLIC', () => {
    const user = buildUser(YoungStatusType.non_eligible)
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.GENERAL_PUBLIC)
  })

  it('should return SUSPENDED', () => {
    const user = buildUser(YoungStatusType.suspended)
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.SUSPENDED)
  })

  it('should return UNKNOWN when statusType is unknown', () => {
    const user = buildUser('unexpected_status')
    const result = getStatusType(user)

    expect(result).toBe(UserStatusType.UNKNOWN)
  })
})
