import { YoungStatusType } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'

import { getShouldDisplayHelpButton } from './getShouldDisplayHelpButton'

describe('getShouldDisplayHelpButton', () => {
  it('should return true when no user is provided (logged out)', () => {
    expect(getShouldDisplayHelpButton({ user: undefined })).toBe(true)
  })

  it('should return true when user status is non_eligible', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...nonBeneficiaryUser,
      status: { statusType: YoungStatusType.non_eligible },
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(true)
  })

  it('should return true when user status is suspended', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...nonBeneficiaryUser,
      status: { statusType: YoungStatusType.suspended },
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(true)
  })

  it('should return false when user status is beneficiary', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      status: { statusType: YoungStatusType.beneficiary },
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })

  it('should return false when user status is eligible', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...nonBeneficiaryUser,
      status: { statusType: YoungStatusType.eligible },
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })

  it('should return false when user status is ex_beneficiary', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      status: { statusType: YoungStatusType.ex_beneficiary },
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })
})
