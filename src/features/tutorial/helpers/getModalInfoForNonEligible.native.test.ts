import { NonEligible, Tutorial } from 'features/tutorial/enums'
import { getModalInfoForNonEligible } from 'features/tutorial/helpers/getModalInfoForNonEligible'

describe('getModalInfoForNonEligible', () => {
  it('should have FAQ link for onboarding non-eligible under 15', () => {
    const { withFAQLink } = getModalInfoForNonEligible(NonEligible.UNDER_15, Tutorial.ONBOARDING)

    expect(withFAQLink).toBeTruthy()
  })

  it('should not have FAQ link for profile tutorial non-eligible over 18', () => {
    const { withFAQLink } = getModalInfoForNonEligible(
      NonEligible.OVER_18,
      Tutorial.PROFILE_TUTORIAL
    )

    expect(withFAQLink).toBeFalsy()
  })

  it('should not have FAQ link for oboarding non-eligible over 18', () => {
    const { withFAQLink } = getModalInfoForNonEligible(NonEligible.OVER_18, Tutorial.ONBOARDING)

    expect(withFAQLink).toBeFalsy()
  })
})
