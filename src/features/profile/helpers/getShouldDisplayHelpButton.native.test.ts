import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'

import { getShouldDisplayHelpButton } from './getShouldDisplayHelpButton'

describe('getShouldDisplayHelpButton', () => {
  it('should return true when no user is provided', () => {
    expect(getShouldDisplayHelpButton({ user: undefined })).toBe(true)
  })

  it('should return true when user is not a beneficiary', () => {
    expect(getShouldDisplayHelpButton({ user: nonBeneficiaryUser })).toBe(true)
  })

  it('should return false when user is a beneficiary', () => {
    expect(getShouldDisplayHelpButton({ user: beneficiaryUser })).toBe(false)
  })
})
