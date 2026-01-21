import { EligibilityType, UserRole } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

import { isUserFreeBeneficiaryOrEligible } from './isUserFreeBeneficiaryOrEligible'

describe('isUserFreeBeneficiaryOrEligible', () => {
  it.each`
    user                                                                             | expected
    ${undefined}                                                                     | ${false}
    ${{ eligibility: EligibilityType.free }}                                         | ${true}
    ${{ eligibility: EligibilityType.underage }}                                     | ${false}
    ${{ roles: [UserRole.FREE_BENEFICIARY] }}                                        | ${true}
    ${{ roles: [UserRole.BENEFICIARY] }}                                             | ${false}
    ${{ eligibility: EligibilityType.free, roles: [] }}                              | ${true}
    ${{ eligibility: EligibilityType.underage, roles: [UserRole.FREE_BENEFICIARY] }} | ${true}
    ${{ eligibility: EligibilityType.underage, roles: undefined }}                   | ${false}
  `(
    'should return $expected for $user.eligibility user and $user.roles roles',
    ({ user, expected }: { user?: UserProfileResponseWithoutSurvey; expected: boolean }) => {
      expect(isUserFreeBeneficiaryOrEligible(user)).toEqual(expected)
    }
  )
})
