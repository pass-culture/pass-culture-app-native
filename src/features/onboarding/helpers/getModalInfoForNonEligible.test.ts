import { getModalInfoForNonEligible } from 'features/onboarding/helpers/getModalInfoForNonEligible'
import { NonEligible } from 'features/onboarding/types'

describe('getModalInfoForNonEligible', () => {
  it('should have FAQ link for underage non-eligible', () => {
    const { withFAQLink } = getModalInfoForNonEligible(NonEligible.UNDER_15)
    expect(withFAQLink).toBeTruthy()
  })

  it('should not have FAQ link for non-eligible over 18', () => {
    const { withFAQLink } = getModalInfoForNonEligible(NonEligible.OVER_18)
    expect(withFAQLink).toBeFalsy()
  })
})
