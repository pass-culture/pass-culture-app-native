import { domains_exhausted_credit_v3 } from 'features/profile/fixtures/domainsCredit'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, exBeneficiaryUser } from 'fixtures/user'

import { getShouldDisplayHelpButton } from './getShouldDisplayHelpButton'

const NOW = new Date()
const ONE_MINUTE_MS = 60_000

const expiredDateISOString = new Date(NOW.getTime() - ONE_MINUTE_MS).toISOString()
const futureDateISOString = new Date(NOW.getTime() + ONE_MINUTE_MS).toISOString()

describe('getShouldDisplayHelpButton', () => {
  it('should return true when no user is provided', () => {
    expect(getShouldDisplayHelpButton({ user: undefined })).toBe(true)
  })

  it('should return true when user is 18 or older and credit is empty', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      domainsCredit: domains_exhausted_credit_v3,
      depositExpirationDate: futureDateISOString,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(true)
  })

  it('should return true when user is 18 or older and deposit is expired', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      depositExpirationDate: expiredDateISOString,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(true)
  })

  it('should return false when user is 18 or older, credit is not empty and deposit is not expired', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      depositExpirationDate: futureDateISOString,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })

  it('should return false when user is 18 or older, credit is not empty and deposit expiration date is missing', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      depositExpirationDate: undefined,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })

  it('should return true when user is 18 or older, credit is empty and deposit expiration date is missing', () => {
    expect(getShouldDisplayHelpButton({ user: exBeneficiaryUser })).toBe(true)
  })

  it('should return false when getAge returns undefined (invalid birthDate)', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      birthDate: undefined,
      depositExpirationDate: expiredDateISOString,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(false)
  })

  it('should return true when user is not a beneficiary even if credit is not empty and deposit not expired', () => {
    const user: UserProfileResponseWithoutSurvey = {
      ...beneficiaryUser,
      isBeneficiary: false,
      domainsCredit: beneficiaryUser.domainsCredit,
      depositExpirationDate: futureDateISOString,
    }

    expect(getShouldDisplayHelpButton({ user })).toBe(true)
  })
})
