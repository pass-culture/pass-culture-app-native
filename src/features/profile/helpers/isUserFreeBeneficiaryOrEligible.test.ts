import { UserRole } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

import { isUserFreeBeneficiaryOrEligible } from './isUserFreeBeneficiaryOrEligible'

describe('isUserFreeBeneficiaryOrEligible', () => {
  it.each`
    user                                                                                                  | expected
    ${undefined}                                                                                          | ${false}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16 }}                                     | ${true}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15 }}                                     | ${true}
    ${{ eligibilityType: UserEligibilityType.NOT_ELIGIBLE }}                                              | ${false}
    ${{ roles: [UserRole.FREE_BENEFICIARY] }}                                                             | ${true}
    ${{ roles: [UserRole.BENEFICIARY] }}                                                                  | ${false}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16, roles: [] }}                          | ${true}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15, roles: [UserRole.FREE_BENEFICIARY] }} | ${true}
    ${{ eligibilityType: UserEligibilityType.NOT_ELIGIBLE, roles: undefined }}                            | ${false}
  `(
    'should return $expected for $user.eligibility user and $user.roles roles',
    ({ user, expected }: { user?: UserProfile; expected: boolean }) => {
      expect(isUserFreeBeneficiaryOrEligible(user)).toEqual(expected)
    }
  )
})
